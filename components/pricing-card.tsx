"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreemCheckout } from "@creem_io/nextjs";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/components/SubscriptionContext";
import { AuthModal } from "@/components/auth-modal";
import Link from "next/link";

/**
 * 计划等级优先级
 */
const PLAN_PRIORITY: Record<string, number> = {
    free: 0,
    "7day": 1,
    monthly: 2,
    lifetime: 3,
};

/**
 * 将显示的 title 映射到内部计划名称
 */
function titleToPlanKey(title: string): string {
    const mapping: Record<string, string> = {
        "Free": "free",
        "7-Day Pass": "7day",
        "Monthly": "monthly",
        "Lifetime": "lifetime",
    };
    return mapping[title] || "free";
}

/**
 * 检查是否可以购买该计划
 */
function canPurchase(currentPlan: string, targetPlan: string): { allowed: boolean; message?: string } {
    const currentPriority = PLAN_PRIORITY[currentPlan] ?? 0;
    const targetPriority = PLAN_PRIORITY[targetPlan] ?? 0;

    // Lifetime 用户不能购买任何计划
    if (currentPlan === "lifetime") {
        return { allowed: false, message: "You're a lifetime member!" };
    }

    // Free 用户可以购买任何付费计划
    if (currentPlan === "free") {
        return { allowed: true };
    }

    // 7-Day Pass 允许叠加购买
    if (currentPlan === "7day" && targetPlan === "7day") {
        return { allowed: true, message: "Add 7 more days" };
    }

    // 其他相同计划不允许重复购买
    if (currentPlan === targetPlan) {
        return { allowed: false, message: "You're already on this plan" };
    }

    // 不允许降级
    if (targetPriority < currentPriority) {
        return { allowed: false, message: "You have a better plan" };
    }

    return { allowed: true };
}

interface PricingCardProps {
    title: string;
    price: string;
    priceDetail?: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant?: "default" | "outline" | "secondary" | "ghost";
    popular?: boolean;
    productId?: string;
    isFree?: boolean;
    isLifetime?: boolean;
}

export function PricingCard({
    title,
    price,
    priceDetail,
    description,
    features,
    buttonText,
    buttonVariant = "default",
    popular = false,
    productId,
    isFree = false,
    isLifetime = false,
}: PricingCardProps) {
    const { user, isSignedIn } = useUser();
    const { plan: currentPlan, isLoading } = useSubscription();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const targetPlan = titleToPlanKey(title);
    const purchaseCheck = canPurchase(currentPlan, targetPlan);

    // 当前计划的标记
    const isCurrentPlan = currentPlan === targetPlan && currentPlan !== "free";

    // 根据计划类型决定按钮样式（统一函数）
    const getButtonClassName = () => {
        if (isFree) {
            return "w-full mb-2 border-gray-300 text-gray-600 hover:bg-gray-50";
        }
        if (isLifetime) {
            // Lifetime: 渐变色
            return "w-full mb-2 bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-lg";
        }
        if (popular) {
            // Monthly: 高饱和度蓝色 + 明显的阴影浮起效果
            return "w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200";
        }
        // 7-Day Pass: 中饱和度蓝色
        return "w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white";
    };

    const buttonClassName = getButtonClassName();

    const renderButton = () => {
        // Free 计划直接跳转到主页
        if (isFree) {
            return (
                <>
                    <Link href="/">
                        <Button
                            variant="outline"
                            className={buttonClassName}
                        >
                            {buttonText}
                        </Button>
                    </Link>
                    {/* Invisible placeholder to align with paid buttons */}
                    <p className="text-center text-xs text-transparent mt-1 select-none" aria-hidden="true">
                        &nbsp;
                    </p>
                </>
            );
        }

        // 付费计划需要 productId
        if (!productId) {
            return (
                <>
                    <Button
                        variant="default"
                        className={buttonClassName}
                        disabled
                    >
                        {buttonText}
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        30-day money-back guarantee
                    </p>
                </>
            );
        }

        // 用户未登录时，显示按钮并触发自定义 AuthModal
        if (!isSignedIn) {
            return (
                <>
                    <Button
                        variant="default"
                        className={buttonClassName}
                        onClick={() => setAuthModalOpen(true)}
                    >
                        {buttonText}
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        30-day money-back guarantee
                    </p>
                    <AuthModal
                        open={authModalOpen}
                        onOpenChange={setAuthModalOpen}
                        defaultMode="sign-in"
                    />
                </>
            );
        }

        // 加载中
        if (isLoading) {
            return (
                <>
                    <Button
                        variant="default"
                        className={buttonClassName}
                        disabled
                    >
                        Loading...
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-1">
                        30-day money-back guarantee
                    </p>
                </>
            );
        }

        // 不允许购买的情况
        if (!purchaseCheck.allowed) {
            return (
                <Button
                    variant="secondary"
                    className="w-full mb-2"
                    disabled
                >
                    {purchaseCheck.message}
                </Button>
            );
        }

        // 允许购买，使用 CreemCheckout
        // 如果有特殊消息（如 7-Day 叠加），显示该消息作为按钮文案
        const displayText = purchaseCheck.message || buttonText;

        return (
            <>
                <CreemCheckout
                    productId={productId}
                    successUrl="/pricing?success=true"
                    referenceId={user?.id}
                    customer={user?.emailAddresses?.[0]?.emailAddress ? {
                        email: user.emailAddresses[0].emailAddress,
                        name: user.fullName || undefined,
                    } : undefined}
                >
                    <Button
                        variant="default"
                        className={buttonClassName}
                    >
                        {displayText}
                    </Button>
                </CreemCheckout>
                <p className="text-center text-xs text-gray-500 mt-1">
                    30-day money-back guarantee
                </p>
            </>
        );
    };

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                popular ? "border-transparent bg-gradient-to-b from-white to-violet-50/30 ring-2 ring-blue-500/50" : "border-gray-200",
                isCurrentPlan && "ring-2 ring-green-500 border-green-500"
            )}
        >
            {/* Current Plan 标记 */}
            {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                    Current Plan
                </div>
            )}

            {/* Most Popular 标记（如果不是当前计划） */}
            {popular && !isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                    Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={cn("text-lg font-semibold", popular ? "text-blue-600" : "text-gray-900")}>
                    {title}
                </h3>
                <div className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-4xl font-bold tracking-tight">{price}</span>
                    {priceDetail && <span className="ml-1 text-sm text-gray-500">{priceDetail}</span>}
                </div>
                <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>

            <ul className="mb-6 flex-1 space-y-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            {renderButton()}
        </div>
    );
}
