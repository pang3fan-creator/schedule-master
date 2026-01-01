"use server";

import { google, calendar_v3 } from "googleapis";
import { clerkClient, auth } from "@clerk/nextjs/server";
import type { Event } from "@/lib/types";

/**
 * 事件映射类型：本地事件ID -> Google Calendar 事件ID
 */
export type EventMapping = Record<string, string>;

/**
 * Google Calendar 颜色映射
 * 本地颜色 -> Google Calendar colorId
 */
const COLOR_MAP: Record<string, string> = {
    blue: "1",
    green: "2",
    purple: "3",
    red: "4",
    yellow: "5",
    orange: "6",
    teal: "7",
    pink: "9",
};

/**
 * 格式化时间为 HH:MM 格式
 */
function formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

/**
 * 获取用户的 Google OAuth Access Token
 */
export async function getGoogleAccessToken(): Promise<string | null> {
    const { userId } = await auth();
    if (!userId) return null;

    try {
        const client = await clerkClient();
        const response = await client.users.getUserOauthAccessToken(userId, "google");

        if (response.data && response.data.length > 0) {
            return response.data[0].token;
        }
        return null;
    } catch (error) {
        console.error("Failed to get Google access token:", error);
        return null;
    }
}

/**
 * 检查用户是否已关联 Google 账号
 */
export async function checkGoogleConnection(): Promise<{
    connected: boolean;
    email?: string;
    hasCalendarScope?: boolean;
}> {
    const { userId } = await auth();
    if (!userId) {
        console.log("[Calendar] No userId found");
        return { connected: false };
    }

    try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        // Clerk 可能使用 "google" 或 "oauth_google" 作为 provider
        const googleAccount = user.externalAccounts?.find(
            (account) => account.provider === "google" || account.provider === "oauth_google"
        );

        console.log("[Calendar] External accounts:", user.externalAccounts?.map(a => ({
            provider: a.provider,
            email: a.emailAddress
        })));

        if (!googleAccount) {
            console.log("[Calendar] No Google account found");
            return { connected: false };
        }

        console.log("[Calendar] Google account found:", googleAccount.emailAddress);

        // 尝试获取 access token 来验证是否有 calendar scope
        const token = await getGoogleAccessToken();
        console.log("[Calendar] Has access token:", !!token);

        return {
            connected: true,
            email: googleAccount.emailAddress || undefined,
            hasCalendarScope: !!token,
        };
    } catch (error) {
        console.error("[Calendar] Failed to check Google connection:", error);
        return { connected: false };
    }
}

/**
 * 创建 Google Calendar API 客户端
 */
async function createCalendarClient(): Promise<calendar_v3.Calendar | null> {
    const accessToken = await getGoogleAccessToken();
    if (!accessToken) return null;

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    return google.calendar({ version: "v3", auth: oauth2Client });
}

/**
 * 获取用户的 Google Calendar 主时区
 */
async function getGoogleCalendarTimezone(calendar: calendar_v3.Calendar): Promise<string> {
    // 方法1：尝试从 settings API 获取
    try {
        const response = await calendar.settings.get({ setting: "timezone" });
        const timezone = response.data.value;
        if (timezone) {
            console.log("[Calendar] User's Google Calendar timezone (from settings):", timezone);
            return timezone;
        }
    } catch (error) {
        console.log("[Calendar] Settings API failed, trying calendars API...", error instanceof Error ? error.message : String(error));
    }

    // 方法2：从主日历获取时区
    try {
        const calendarResponse = await calendar.calendars.get({ calendarId: "primary" });
        const timezone = calendarResponse.data.timeZone;
        if (timezone) {
            console.log("[Calendar] User's Google Calendar timezone (from primary calendar):", timezone);
            return timezone;
        }
    } catch (error) {
        console.error("[Calendar] Failed to get timezone from primary calendar:", error instanceof Error ? error.message : String(error));
    }

    console.log("[Calendar] Could not determine timezone, using UTC");
    return "UTC";
}

/**
 * 将本地事件转换为 Google Calendar 事件格式
 */
function convertToGoogleEvent(
    event: Event,
    targetDate: Date,
    timeZone: string
): calendar_v3.Schema$Event {
    // 格式化日期为 YYYY-MM-DD
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const startTime = formatTime(event.startHour, event.startMinute);
    const endTime = formatTime(event.endHour, event.endMinute);
    const startDateTime = `${dateStr}T${startTime}:00`;
    const endDateTime = `${dateStr}T${endTime}:00`;

    // 获取颜色映射
    const colorId = event.color ? COLOR_MAP[event.color] || "1" : "1";

    console.log(`[Calendar] Converting event: ${event.title}, date: ${dateStr}, time: ${startTime}-${endTime}, timezone: ${timeZone}`);

    return {
        summary: event.title,
        description: event.description || undefined,
        start: {
            dateTime: startDateTime,
            timeZone: timeZone,
        },
        end: {
            dateTime: endDateTime,
            timeZone: timeZone,
        },
        colorId,
    };
}

/**
 * 根据 day 和 weekStartsOnSunday 计算星期几 (0=周日, 1=周一, ..., 6=周六)
 */
function getDayOfWeek(day: number, weekStartsOnSunday: boolean): number {
    if (weekStartsOnSunday) {
        // day 0 = 周日, day 1 = 周一, ..., day 6 = 周六
        return day;
    } else {
        // day 0 = 周一, day 1 = 周二, ..., day 6 = 周日
        // 转换为: 0 -> 1(周一), 1 -> 2(周二), ..., 6 -> 0(周日)
        return (day + 1) % 7;
    }
}

/**
 * 同步事件到 Google Calendar
 * @param events 要同步的事件列表
 * @param weekStart 当前周的起始日期
 * @param weekStartsOnSunday 周是否从周日开始
 * @param timeZone 用户浏览器时区（备用）
 * @param existingMappings 已存在的事件映射（本地ID -> Google Calendar ID）
 */
export async function syncEventsToGoogleCalendar(
    events: Event[],
    weekStart: Date,
    weekStartsOnSunday: boolean,
    timeZone: string,
    existingMappings: EventMapping = {}
): Promise<{
    success: boolean;
    synced: number;
    failed: number;
    errors: Array<{ eventId: string; error: string }>;
    mappings: EventMapping;  // 返回更新后的映射
}> {
    const calendar = await createCalendarClient();
    if (!calendar) {
        return {
            success: false,
            synced: 0,
            failed: events.length,
            errors: [{ eventId: "all", error: "Failed to create Google Calendar client" }],
            mappings: existingMappings,
        };
    }

    // 尝试获取 Google Calendar 时区，如果失败则使用用户浏览器时区
    let eventTimezone = timeZone;

    const googleCalendarTimezone = await getGoogleCalendarTimezone(calendar);
    if (googleCalendarTimezone !== "UTC") {
        eventTimezone = googleCalendarTimezone;
    }

    const results = {
        synced: 0,
        failed: 0,
        errors: [] as Array<{ eventId: string; error: string }>,
    };

    // 新的映射（会包含所有已同步事件的映射）
    const newMappings: EventMapping = { ...existingMappings };

    console.log(`[Calendar] Syncing ${events.length} events, weekStart: ${weekStart.toISOString()}, weekStartsOnSunday: ${weekStartsOnSunday}, eventTimezone: ${eventTimezone}`);
    console.log(`[Calendar] Existing mappings: ${Object.keys(existingMappings).length} events`);

    // 处理每个事件
    for (const event of events) {
        const targetDate = new Date(weekStart);
        targetDate.setDate(weekStart.getDate() + event.day);

        const googleEvent = convertToGoogleEvent(event, targetDate, eventTimezone);
        const existingGoogleId = existingMappings[event.id];

        try {
            if (existingGoogleId) {
                // 已存在映射，更新事件
                console.log(`[Calendar] Updating existing event "${event.title}" (Google ID: ${existingGoogleId})`);
                await calendar.events.update({
                    calendarId: "primary",
                    eventId: existingGoogleId,
                    requestBody: googleEvent,
                });
                results.synced++;
            } else {
                // 新事件，创建并保存映射
                console.log(`[Calendar] Creating new event "${event.title}"`);
                const response = await calendar.events.insert({
                    calendarId: "primary",
                    requestBody: googleEvent,
                });

                // 保存映射
                if (response.data.id) {
                    newMappings[event.id] = response.data.id;
                    console.log(`[Calendar] Created event with Google ID: ${response.data.id}`);
                }
                results.synced++;
            }
        } catch (error) {
            // 如果更新失败（可能事件被删除了），尝试创建新事件
            if (existingGoogleId && error instanceof Error && error.message.includes("Not Found")) {
                console.log(`[Calendar] Event not found in Google Calendar, creating new...`);
                try {
                    const response = await calendar.events.insert({
                        calendarId: "primary",
                        requestBody: googleEvent,
                    });
                    if (response.data.id) {
                        newMappings[event.id] = response.data.id;
                    }
                    results.synced++;
                    continue;
                } catch (retryError) {
                    // 重试也失败了
                }
            }

            results.failed++;
            results.errors.push({
                eventId: event.id,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            console.error(`[Calendar] Failed to sync event "${event.title}":`, error);
        }
    }

    return {
        success: results.failed === 0,
        ...results,
        mappings: newMappings,
    };
}
