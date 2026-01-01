import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";
import { generateSchedule, type GeneratedEvent } from "@/lib/deepseek";
import { NextResponse } from "next/server";

const MONTHLY_LIMIT = 30;
const MAX_PROMPT_LENGTH = 2000;

/**
 * Get current month in YYYY-MM format
 */
function getCurrentMonthYear(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * POST: Generate schedule using AI
 */
export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check Pro status
        const userIsPro = await isPro();
        if (!userIsPro) {
            return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
        }

        // Parse request body
        const body = await request.json();
        const {
            prompt,
            workingHoursStart = 8,
            workingHoursEnd = 18,
            weekStartsOnSunday = true,
            use12HourFormat = true
        } = body;

        // Validate prompt
        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        if (prompt.length > MAX_PROMPT_LENGTH) {
            return NextResponse.json(
                { error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or less` },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const monthYear = getCurrentMonthYear();

        // Check usage limit
        const { data: usageData } = await supabase
            .from("ai_usage")
            .select("usage_count")
            .eq("clerk_user_id", userId)
            .eq("month_year", monthYear)
            .single();

        const currentUsage = usageData?.usage_count || 0;

        if (currentUsage >= MONTHLY_LIMIT) {
            return NextResponse.json(
                {
                    error: "Monthly usage limit reached",
                    code: "USAGE_LIMIT_EXCEEDED",
                    usage: currentUsage,
                    limit: MONTHLY_LIMIT,
                },
                { status: 429 }
            );
        }

        // Generate schedule using DeepSeek
        let events: GeneratedEvent[];
        let settings: any; // Inferred settings

        try {
            const result = await generateSchedule({
                userPrompt: prompt.trim(),
                currentSettings: {
                    workingHoursStart,
                    workingHoursEnd,
                    weekStartsOnSunday,
                    use12HourFormat
                }
            });
            events = result.events;
            settings = result.settings;
        } catch (error) {
            console.error("AI generation error:", error);
            return NextResponse.json(
                { error: "Failed to generate schedule. Please try again." },
                { status: 500 }
            );
        }

        // Update usage count
        if (usageData) {
            // Update existing record
            await supabase
                .from("ai_usage")
                .update({
                    usage_count: currentUsage + 1,
                    updated_at: new Date().toISOString(),
                })
                .eq("clerk_user_id", userId)
                .eq("month_year", monthYear);
        } else {
            // Insert new record
            await supabase.from("ai_usage").insert({
                clerk_user_id: userId,
                month_year: monthYear,
                usage_count: 1,
            });
        }

        return NextResponse.json({
            events,
            settings,
            usage: {
                used: currentUsage + 1,
                limit: MONTHLY_LIMIT,
                remaining: MONTHLY_LIMIT - currentUsage - 1,
            },
        });
    } catch (error) {
        console.error("Error in POST /api/ai/autofill:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
