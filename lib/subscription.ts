import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export type SubscriptionPlan = "free" | "7day" | "monthly" | "lifetime";

export interface Subscription {
    plan: SubscriptionPlan;
    status: string;
    expiresAt: string | null;
    customerId: string | null;
}

/**
 * 获取当前登录用户的订阅信息
 */
export async function getUserSubscription(): Promise<Subscription> {
    const { userId } = await auth();

    if (!userId) {
        return { plan: "free", status: "active", expiresAt: null, customerId: null };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("clerk_user_id", userId)
        .single();

    if (error || !data) {
        return { plan: "free", status: "active", expiresAt: null, customerId: null };
    }

    // 检查 7day pass 是否过期
    if (data.plan === "7day" && data.expires_at) {
        if (new Date(data.expires_at) < new Date()) {
            return {
                plan: "free",
                status: "expired",
                expiresAt: data.expires_at,
                customerId: data.creem_customer_id,
            };
        }
    }

    return {
        plan: data.plan as SubscriptionPlan,
        status: data.status,
        expiresAt: data.expires_at,
        customerId: data.creem_customer_id,
    };
}

/**
 * 检查当前用户是否为付费用户
 */
export async function isPro(): Promise<boolean> {
    const sub = await getUserSubscription();
    return sub.plan !== "free" && sub.status === "active";
}

/**
 * 获取订阅计划的显示名称
 */
export function getPlanDisplayName(plan: SubscriptionPlan): string {
    const names: Record<SubscriptionPlan, string> = {
        free: "Free",
        "7day": "7-Day Pass",
        monthly: "Pro Monthly",
        lifetime: "Lifetime",
    };
    return names[plan];
}
