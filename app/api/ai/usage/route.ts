import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";
import { NextResponse } from "next/server";

const MONTHLY_LIMIT = 100;
const TRIAL_LIMIT = 3;

/**
 * Get current month in YYYY-MM format
 */
function getCurrentMonthYear(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * GET: Get current user's AI usage for this month (Pro) or lifetime trial (Free)
 */
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = await createClient();
        const userIsPro = await isPro();

        // If Pro, track per month. If Free, track lifetime trial.
        const monthYear = userIsPro ? getCurrentMonthYear() : "lifetime_trial";
        const limit = userIsPro ? MONTHLY_LIMIT : TRIAL_LIMIT;

        const { data } = await supabase
            .from("ai_usage")
            .select("usage_count")
            .eq("clerk_user_id", userId)
            .eq("month_year", monthYear)
            .single();

        const usedCount = data?.usage_count || 0;

        return NextResponse.json({
            isPro: userIsPro,
            usage: {
                used: usedCount,
                limit: limit,
                remaining: Math.max(0, limit - usedCount),
            },
        });
    } catch (error) {
        console.error("Error in GET /api/ai/usage:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
