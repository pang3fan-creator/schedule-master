import { Webhook } from "@creem_io/nextjs";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * 计划等级优先级（数字越大等级越高）
 */
const PLAN_PRIORITY: Record<string, number> = {
  free: 0,
  "7day": 1,
  monthly: 2,
  lifetime: 3,
};

/**
 * Creem API 基础配置
 */
const CREEM_API_BASE = "https://api.creem.io/v1";
const CREEM_API_KEY = process.env.CREEM_API_KEY || "";

/**
 * 调用 Creem API 取消订阅
 * @param subscriptionId - Creem 订阅 ID
 */
async function cancelCreemSubscription(
  subscriptionId: string,
): Promise<boolean> {
  try {
    console.log(`Cancelling Creem subscription: ${subscriptionId}`);

    const response = await fetch(
      `${CREEM_API_BASE}/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "x-api-key": CREEM_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(
        `Failed to cancel subscription: ${response.status} - ${error}`,
      );
      return false;
    }

    console.log(`Successfully cancelled Creem subscription: ${subscriptionId}`);
    return true;
  } catch (error) {
    console.error("Error cancelling Creem subscription:", error);
    return false;
  }
}

/**
 * 根据产品信息确定订阅计划类型
 */
function determinePlan(product: {
  billing_type?: string;
  name: string;
}): "7day" | "monthly" | "lifetime" {
  if (product.billing_type === "recurring") {
    return "monthly";
  } else if (
    product.name.toLowerCase().includes("7-day") ||
    product.name.toLowerCase().includes("7 day")
  ) {
    return "7day";
  } else {
    return "lifetime";
  }
}

/**
 * 获取用户当前的订阅计划
 */
async function getCurrentPlan(userId: string): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status, expires_at")
    .eq("clerk_user_id", userId)
    .single();

  if (error || !data) {
    return "free";
  }

  // 检查 7-day pass 是否已过期
  if (data.plan === "7day" && data.expires_at) {
    if (new Date(data.expires_at) < new Date()) {
      return "free"; // 已过期，视为 free
    }
  }

  // 检查是否已取消
  if (data.status === "canceled" || data.status === "expired") {
    return "free";
  }

  return data.plan;
}

/**
 * 检查是否允许购买新计划（防止降级和重复购买）
 */
function canUpgrade(
  currentPlan: string,
  newPlan: string,
): { allowed: boolean; reason?: string; isStacking?: boolean } {
  const currentPriority = PLAN_PRIORITY[currentPlan] ?? 0;
  const newPriority = PLAN_PRIORITY[newPlan] ?? 0;

  // Lifetime 用户不能购买任何计划
  if (currentPlan === "lifetime") {
    return { allowed: false, reason: "User already has lifetime subscription" };
  }

  // 7-Day Pass 允许叠加购买
  if (currentPlan === "7day" && newPlan === "7day") {
    return { allowed: true, isStacking: true };
  }

  // 其他相同计划不允许重复购买（Monthly 自动续订由 Creem 处理）
  if (currentPlan === newPlan) {
    return { allowed: false, reason: `User already has ${currentPlan} plan` };
  }

  // 不允许降级
  if (newPriority < currentPriority) {
    return {
      allowed: false,
      reason: `Downgrade from ${currentPlan} to ${newPlan} is not allowed`,
    };
  }

  return { allowed: true };
}

/**
 * 保存订阅信息到 Supabase
 * @param isStacking - 是否为 7-Day Pass 叠加购买
 * @param subscriptionId - Creem 订阅 ID (仅 Monthly 有)
 */
async function saveSubscription(
  userId: string,
  customerId: string,
  plan: "7day" | "monthly" | "lifetime",
  isStacking: boolean = false,
  subscriptionId?: string,
) {
  const supabase = createAdminClient();

  // 获取当前订阅信息，用于计算叠加/升级逻辑
  const { data: current } = await supabase
    .from("subscriptions")
    .select("plan, expires_at, creem_subscription_id")
    .eq("clerk_user_id", userId)
    .single();

  let expiresAt: string | null = null;
  let bonusDays = 0;

  if (plan === "7day") {
    // 7-Day 叠加逻辑：从当前过期时间或现在开始 +7天
    if (isStacking && current?.plan === "7day" && current.expires_at) {
      const currentExpiry = new Date(current.expires_at);
      // 如果当前订阅尚未过期，从过期时间开始叠加
      const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
      expiresAt = new Date(
        baseDate.getTime() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      console.log(
        `7-Day stacking: extending from ${current.expires_at} to ${expiresAt}`,
      );
    } else {
      // 新购买，从现在开始 +7天
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  } else if (
    plan === "monthly" &&
    current?.plan === "7day" &&
    current.expires_at
  ) {
    // 升级 Monthly 时，计算剩余 7-Day 天数作为 bonus
    const remaining = new Date(current.expires_at).getTime() - Date.now();
    bonusDays = Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
    console.log(
      `Upgrade from 7-Day to Monthly: ${bonusDays} bonus days granted`,
    );
  } else if (
    plan === "lifetime" &&
    current?.plan === "monthly" &&
    current.creem_subscription_id
  ) {
    // 升级到 Lifetime 时，取消现有的 Monthly 订阅
    console.log(
      `Upgrading from Monthly to Lifetime, cancelling subscription: ${current.creem_subscription_id}`,
    );
    const cancelled = await cancelCreemSubscription(
      current.creem_subscription_id,
    );
    if (!cancelled) {
      console.warn(
        `Failed to cancel subscription ${current.creem_subscription_id}, but proceeding with upgrade`,
      );
    }
  }

  console.log(
    `Saving subscription for user ${userId}, plan: ${plan}, expires: ${expiresAt}, bonusDays: ${bonusDays}`,
  );

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        clerk_user_id: userId,
        creem_customer_id: customerId,
        creem_subscription_id: plan === "monthly" ? subscriptionId : null,
        plan,
        status: "active",
        expires_at: expiresAt,
        bonus_days: bonusDays > 0 ? bonusDays : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" },
    )
    .select();

  if (error) {
    console.error("Error upserting subscription:", error);
  } else {
    console.log(`Subscription saved successfully:`, data);
  }
}

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  /**
   * onCheckoutCompleted - 处理所有类型的结账完成事件
   * 包括一次性付款（7-day pass, lifetime）和订阅首次付款
   */
  onCheckoutCompleted: async ({
    customer,
    product,
    metadata,
    subscription,
  }) => {
    console.log("=== Webhook onCheckoutCompleted triggered ===");
    console.log("Product:", product.name, "Type:", product.billing_type);
    console.log("Subscription ID:", subscription?.id);

    const userId = metadata?.referenceId as string;
    if (!userId) {
      console.error("No referenceId in webhook metadata (onCheckoutCompleted)");
      return;
    }

    const newPlan = determinePlan(product);
    const currentPlan = await getCurrentPlan(userId);

    console.log(
      `User ${userId}: current plan = ${currentPlan}, new plan = ${newPlan}`,
    );

    // 检查是否允许购买
    const { allowed, reason, isStacking } = canUpgrade(currentPlan, newPlan);
    if (!allowed) {
      console.log(`Purchase blocked: ${reason}`);
      // 注意：此时 Creem 已经收款，但我们不更新数据库
      // 实际生产环境中应该触发退款流程
      return;
    }

    await saveSubscription(
      userId,
      customer?.id || "",
      newPlan,
      isStacking,
      subscription?.id,
    );
  },

  /**
   * onGrantAccess - 处理订阅激活事件（订阅续费时也会触发）
   * 主要用于订阅型产品
   * 注意：此事件的参数结构是 NormalizedSubscriptionEntity，包含 id 字段
   */
  onGrantAccess: async (event) => {
    const { customer, product, metadata, id: subscriptionId } = event;
    console.log("=== Webhook onGrantAccess triggered ===");
    console.log("Product:", product.name, "Type:", product.billing_type);
    console.log("Subscription ID:", subscriptionId);

    const userId = metadata?.referenceId as string;
    if (!userId) {
      console.error("No referenceId in webhook metadata (onGrantAccess)");
      return;
    }

    const newPlan = determinePlan(product);
    const currentPlan = await getCurrentPlan(userId);

    console.log(
      `User ${userId}: current plan = ${currentPlan}, new plan = ${newPlan}`,
    );

    // 检查是否允许购买
    const { allowed, reason, isStacking } = canUpgrade(currentPlan, newPlan);
    if (!allowed) {
      console.log(`Purchase blocked: ${reason}`);
      return;
    }

    await saveSubscription(
      userId,
      customer.id,
      newPlan,
      isStacking,
      subscriptionId,
    );
  },

  /**
   * onRevokeAccess - 处理订阅取消/过期事件
   */
  onRevokeAccess: async ({ metadata }) => {
    console.log("=== Webhook onRevokeAccess triggered ===");

    const supabase = createAdminClient();
    const userId = metadata?.referenceId as string;

    if (!userId) {
      console.error("No referenceId in webhook metadata for revoke");
      return;
    }

    // 只对 monthly 订阅执行撤销（lifetime 永不过期，7day 有 expires_at）
    const { data: current } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("clerk_user_id", userId)
      .single();

    if (current?.plan === "monthly") {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          plan: "free",
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", userId);

      if (error) {
        console.error("Error revoking subscription:", error);
      } else {
        console.log(`Monthly subscription revoked for user ${userId}`);
      }
    } else {
      console.log(
        `Skipping revoke for user ${userId} with plan ${current?.plan}`,
      );
    }
  },
});
