import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";
import { NextResponse } from "next/server";

const MONTHLY_LIMIT = 100;

/**
 * Get current month in YYYY-MM format
 */
function getCurrentMonthYear(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * GET: Get current user's AI usage for this month
 */
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check Pro status
        const userIsPro = await isPro();
        if (!userIsPro) {
            return NextResponse.json(
                {
                    isPro: false,
                    usage: { used: 0, limit: 0, remaining: 0 },
                },
                { status: 200 }
            );
        }

        const supabase = await createClient();
        const monthYear = getCurrentMonthYear();

        const { data } = await supabase
            .from("ai_usage")
            .select("usage_count")
            .eq("clerk_user_id", userId)
            .eq("month_year", monthYear)
            .single();

        const usedCount = data?.usage_count || 0;

        return NextResponse.json({
            isPro: true,
            usage: {
                used: usedCount,
                limit: MONTHLY_LIMIT,
                remaining: Math.max(0, MONTHLY_LIMIT - usedCount),
            },
        });
    } catch (error) {
        console.error("Error in GET /api/ai/usage:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
