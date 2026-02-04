import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  syncEventsToGoogleCalendar,
  type EventMapping,
} from "@/lib/google-calendar";
import { isPro } from "@/lib/subscription";
import type { Event } from "@/lib/types";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 检查是否是 Pro 用户
  const userIsPro = await isPro();
  if (!userIsPro) {
    return NextResponse.json(
      { error: "Pro subscription required" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const {
      events,
      weekStart,
      weekStartsOnSunday,
      timeZone,
      existingMappings,
    } = body as {
      events: Event[];
      weekStart: string;
      weekStartsOnSunday: boolean;
      timeZone: string;
      existingMappings?: EventMapping;
    };

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Invalid events data" },
        { status: 400 },
      );
    }

    const weekStartDate = new Date(weekStart);
    const result = await syncEventsToGoogleCalendar(
      events,
      weekStartDate,
      weekStartsOnSunday,
      timeZone || "Asia/Shanghai",
      existingMappings || {},
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Calendar sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync events" },
      { status: 500 },
    );
  }
}
