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
 * 根据产品信息确定订阅计划类型
 */
function determinePlan(product: { billing_type?: string; name: string }): "7day" | "monthly" | "lifetime" {
    if (product.billing_type === "recurring") {
        return "monthly";
    } else if (product.name.toLowerCase().includes("7-day") || product.name.toLowerCase().includes("7 day")) {
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
function canUpgrade(currentPlan: string, newPlan: string): { allowed: boolean; reason?: string } {
    const currentPriority = PLAN_PRIORITY[currentPlan] ?? 0;
    const newPriority = PLAN_PRIORITY[newPlan] ?? 0;

    // Lifetime 用户不能购买任何计划
    if (currentPlan === "lifetime") {
        return { allowed: false, reason: "User already has lifetime subscription" };
    }

    // 不允许重复购买相同计划
    if (currentPlan === newPlan) {
        return { allowed: false, reason: `User already has ${currentPlan} plan` };
    }

    // 不允许降级
    if (newPriority < currentPriority) {
        return { allowed: false, reason: `Downgrade from ${currentPlan} to ${newPlan} is not allowed` };
    }

    return { allowed: true };
}

/**
 * 保存订阅信息到 Supabase
 */
async function saveSubscription(
    userId: string,
    customerId: string,
    plan: "7day" | "monthly" | "lifetime"
) {
    const supabase = createAdminClient();

    // 计算过期时间 (仅 7day pass 有过期时间)
    const expiresAt = plan === "7day"
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : null;

    console.log(`Saving subscription for user ${userId}, plan: ${plan}`);

    const { data, error } = await supabase.from("subscriptions").upsert(
        {
            clerk_user_id: userId,
            creem_customer_id: customerId,
            plan,
            status: "active",
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
        },
        { onConflict: "clerk_user_id" }
    ).select();

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
    onCheckoutCompleted: async ({ customer, product, metadata }) => {
        console.log("=== Webhook onCheckoutCompleted triggered ===");
        console.log("Product:", product.name, "Type:", product.billing_type);

        const userId = metadata?.referenceId as string;
        if (!userId) {
            console.error("No referenceId in webhook metadata (onCheckoutCompleted)");
            return;
        }

        const newPlan = determinePlan(product);
        const currentPlan = await getCurrentPlan(userId);

        console.log(`User ${userId}: current plan = ${currentPlan}, new plan = ${newPlan}`);

        // 检查是否允许购买
        const { allowed, reason } = canUpgrade(currentPlan, newPlan);
        if (!allowed) {
            console.log(`Purchase blocked: ${reason}`);
            // 注意：此时 Creem 已经收款，但我们不更新数据库
            // 实际生产环境中应该触发退款流程
            return;
        }

        await saveSubscription(userId, customer?.id || "", newPlan);
    },

    /**
     * onGrantAccess - 处理订阅激活事件（订阅续费时也会触发）
     * 主要用于订阅型产品
     */
    onGrantAccess: async ({ customer, product, metadata }) => {
        console.log("=== Webhook onGrantAccess triggered ===");
        console.log("Product:", product.name, "Type:", product.billing_type);

        const userId = metadata?.referenceId as string;
        if (!userId) {
            console.error("No referenceId in webhook metadata (onGrantAccess)");
            return;
        }

        const newPlan = determinePlan(product);
        const currentPlan = await getCurrentPlan(userId);

        console.log(`User ${userId}: current plan = ${currentPlan}, new plan = ${newPlan}`);

        // 检查是否允许购买
        const { allowed, reason } = canUpgrade(currentPlan, newPlan);
        if (!allowed) {
            console.log(`Purchase blocked: ${reason}`);
            return;
        }

        await saveSubscription(userId, customer.id, newPlan);
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
            console.log(`Skipping revoke for user ${userId} with plan ${current?.plan}`);
        }
    },
});
