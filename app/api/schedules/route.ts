import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";
import { NextResponse } from "next/server";

const MAX_TEMPLATES = 50;
const MAX_NAME_LENGTH = 50;
const DEFAULT_PAGE_SIZE = 10;

// GET: List templates for current user with pagination
export async function GET(request: Request) {
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

        // Parse pagination params
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10)));
        const sortBy = searchParams.get("sortBy") || "updated_at";
        const sortOrder = searchParams.get("sortOrder") === "asc" ? true : false;

        // Map frontend sort options to database columns
        const sortColumn = sortBy === "created" ? "created_at" : sortBy === "name" ? "name" : "updated_at";

        const supabase = await createClient();

        // Get total count
        const { count: totalCount, error: countError } = await supabase
            .from("user_schedules")
            .select("*", { count: "exact", head: true })
            .eq("clerk_user_id", userId);

        if (countError) {
            console.error("Error counting schedules:", countError);
            return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
        }

        // Calculate pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        // Fetch paginated data
        const { data, error } = await supabase
            .from("user_schedules")
            .select("id, name, event_count, created_at, updated_at")
            .eq("clerk_user_id", userId)
            .order(sortColumn, { ascending: sortOrder })
            .range(from, to);

        if (error) {
            console.error("Error fetching schedules:", error);
            return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
        }

        return NextResponse.json({
            schedules: data || [],
            pagination: {
                page,
                pageSize,
                totalCount: totalCount || 0,
                totalPages: Math.ceil((totalCount || 0) / pageSize),
            },
            maxTemplates: MAX_TEMPLATES,
        });
    } catch (error) {
        console.error("Error in GET /api/schedules:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST: Create new template
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

        const body = await request.json();
        const { name, events, settings } = body;

        // Validate name
        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (name.length > MAX_NAME_LENGTH) {
            return NextResponse.json({ error: `Name must be ${MAX_NAME_LENGTH} characters or less` }, { status: 400 });
        }

        // Validate events
        if (!events || !Array.isArray(events)) {
            return NextResponse.json({ error: "Events array is required" }, { status: 400 });
        }

        const supabase = await createClient();

        // Check template count limit
        const { count, error: countError } = await supabase
            .from("user_schedules")
            .select("*", { count: "exact", head: true })
            .eq("clerk_user_id", userId);

        if (countError) {
            console.error("Error counting schedules:", countError);
            return NextResponse.json({ error: "Failed to check template limit" }, { status: 500 });
        }

        if (count !== null && count >= MAX_TEMPLATES) {
            return NextResponse.json({
                error: `Maximum ${MAX_TEMPLATES} templates allowed. Please delete some templates first.`,
                code: "LIMIT_REACHED"
            }, { status: 400 });
        }

        // Check for duplicate name
        const { data: existing } = await supabase
            .from("user_schedules")
            .select("id")
            .eq("clerk_user_id", userId)
            .eq("name", name.trim())
            .single();

        if (existing) {
            return NextResponse.json({
                error: "A template with this name already exists",
                code: "DUPLICATE_NAME",
                existingId: existing.id
            }, { status: 409 });
        }

        // Insert new template
        const { data, error } = await supabase
            .from("user_schedules")
            .insert({
                clerk_user_id: userId,
                name: name.trim(),
                events,
                settings,
                event_count: events.length,
            })
            .select("id, name, event_count, created_at, updated_at")
            .single();

        if (error) {
            console.error("Error creating schedule:", error);
            return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
        }

        return NextResponse.json({ schedule: data }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/schedules:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
