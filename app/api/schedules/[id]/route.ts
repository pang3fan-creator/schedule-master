import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { isPro } from "@/lib/subscription";
import { NextResponse } from "next/server";

const MAX_NAME_LENGTH = 50;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Get single template with full data
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIsPro = await isPro();
    if (!userIsPro) {
      return NextResponse.json(
        { error: "Pro subscription required" },
        { status: 403 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_schedules")
      .select("*")
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ schedule: data });
  } catch (error) {
    console.error("Error in GET /api/schedules/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT: Update template (rename or overwrite contents)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIsPro = await isPro();
    if (!userIsPro) {
      return NextResponse.json(
        { error: "Pro subscription required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, events, settings } = body;

    const supabase = await createClient();

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("user_schedules")
      .select("id, name")
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Handle name update
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });
      }

      if (name.length > MAX_NAME_LENGTH) {
        return NextResponse.json(
          { error: `Name must be ${MAX_NAME_LENGTH} characters or less` },
          { status: 400 },
        );
      }

      // Check for duplicate name (if name is changing)
      if (name.trim() !== existing.name) {
        const { data: duplicate } = await supabase
          .from("user_schedules")
          .select("id")
          .eq("clerk_user_id", userId)
          .eq("name", name.trim())
          .neq("id", id)
          .single();

        if (duplicate) {
          return NextResponse.json(
            {
              error: "A template with this name already exists",
              code: "DUPLICATE_NAME",
            },
            { status: 409 },
          );
        }
      }

      updateData.name = name.trim();
    }

    // Handle events update
    if (events !== undefined) {
      if (!Array.isArray(events)) {
        return NextResponse.json(
          { error: "Events must be an array" },
          { status: 400 },
        );
      }
      updateData.events = events;
      updateData.event_count = events.length;
    }

    // Handle settings update
    if (settings !== undefined) {
      updateData.settings = settings;
    }

    const { data, error } = await supabase
      .from("user_schedules")
      .update(updateData)
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .select("id, name, event_count, created_at, updated_at")
      .single();

    if (error) {
      console.error("Error updating schedule:", error);
      return NextResponse.json(
        { error: "Failed to update template" },
        { status: 500 },
      );
    }

    return NextResponse.json({ schedule: data });
  } catch (error) {
    console.error("Error in PUT /api/schedules/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE: Delete template
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIsPro = await isPro();
    if (!userIsPro) {
      return NextResponse.json(
        { error: "Pro subscription required" },
        { status: 403 },
      );
    }

    const supabase = await createClient();

    // Delete with ownership check
    const { error } = await supabase
      .from("user_schedules")
      .delete()
      .eq("id", id)
      .eq("clerk_user_id", userId);

    if (error) {
      console.error("Error deleting schedule:", error);
      return NextResponse.json(
        { error: "Failed to delete template" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/schedules/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
