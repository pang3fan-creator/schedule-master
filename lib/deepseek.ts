import OpenAI from "openai";
import { type Event, type EventColor } from "@/lib/types";

// DeepSeek API client (OpenAI-compatible)
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

// Available colors for events
const VALID_COLORS: EventColor[] = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "pink",
  "orange",
  "teal",
];

// System prompt for schedule generation - Combined Chinese/English for clarity
const SYSTEM_PROMPT = `你是一个专业的日程规划助手。根据用户的描述，生成一周的日程安排，并推断合适的用户设置。

## 任务目标
1. **生成日程**：根据用户描述，生成具体的日程事件。
2. **推断设置**：根据用户描述（如语言、地区习惯、活动时间范围），推断最合适的日历设置。

## 输出格式 (JSON)
你必须输出一个包含 \`events\` 和 \`settings\` 的 JSON 对象：
\`\`\`json
{
  "events": [
    {
      "title": "晨间锻炼",
      "description": "跑步",
      "day": 1, // 0-6 (周日-周六)
      "startHour": 7,
      "startMinute": 0,
      "endHour": 8,
      "endMinute": 0,
      "color": "green" // "blue", "green", "red", "yellow", "purple", "pink", "orange", "teal"
    }
  ],
  "settings": {
    "weekStartsOnSunday": true, // 根据地区习惯判断 (如美国/日本为 true, 欧洲/中国为 false)
    "use12HourFormat": true,    // 根据语言习惯判断 (如英语环境常用 true, 中文环境常用 false)
    "showDates": true,          // 默认 true
    "workingHoursStart": 8,     // 根据最早活动时间调整，覆盖所有活动
    "workingHoursEnd": 18,      // 根据最晚活动时间调整，覆盖所有活动
    "timeIncrement": 60         // 5, 15, 30, 或 60 (分钟)
  }
}
\`\`\`

## 严格规则 (CRITICAL)
1. **绝无重叠**：同一天内的时间块绝对不能重叠。如果用户描述冲突，请优先保留更具体的活动，或调整前一个活动的结束时间。
2. **时间范围**：所有事件必须在 00:00 到 23:59 之间。结束时间必须晚于开始时间。
3. **设置覆盖**：\`settings.workingHoursStart\` 和 \`settings.workingHoursEnd\` 必须**包含**所有生成的事件。如果用户有早上6点的活动，\`workingHoursStart\` 必须 <= 6。如果用户有晚上10点的活动，\`workingHoursEnd\` 必须 >= 22。
4. **完整性**：用户提到的所有活动必须出现在日程中，不能遗漏。
5. **JSON 格式**：只输出合法的 JSON，不要包裹在 Markdown 代码块中。

## 示例
用户："我是美国大学生，这学期课很满，早上8点到晚上9点都要用。"
推断设置：weekStartsOnSunday: true (美国), workingHoursStart: 8, workingHoursEnd: 21, use12HourFormat: true
`;

export interface GeneratedEvent {
  title: string;
  description: string;
  day: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  color: EventColor;
}

export interface InferredSettings {
  weekStartsOnSunday: boolean;
  use12HourFormat: boolean;
  showDates: boolean;
  workingHoursStart: number;
  workingHoursEnd: number;
  timeIncrement: 5 | 15 | 30 | 60;
}

export interface GenerateScheduleResponse {
  events: GeneratedEvent[];
  settings?: InferredSettings;
}

export interface GenerateScheduleOptions {
  userPrompt: string;
  // Current settings provided as context/fallback
  currentSettings: {
    workingHoursStart: number;
    workingHoursEnd: number;
    weekStartsOnSunday: boolean;
    use12HourFormat: boolean;
  };
}

/**
 * Generate schedule events and infer settings using DeepSeek API
 */
export async function generateSchedule(
  options: GenerateScheduleOptions,
): Promise<GenerateScheduleResponse> {
  const { userPrompt, currentSettings } = options;

  const userMessage = `用户描述：${userPrompt}

当前参考设置（可根据需求修改）：
- 工作时间：${currentSettings.workingHoursStart}:00 - ${currentSettings.workingHoursEnd}:00
- 周首日：${currentSettings.weekStartsOnSunday ? "周日" : "周一"}
- 12小时制：${currentSettings.use12HourFormat ? "是" : "否"}

请生成日程并返回新的设置。`;

  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.5, // Lower temperature for more strict adherence to rules
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from DeepSeek API");
    }

    // Parse JSON response
    const parsed = JSON.parse(content);

    // Handle legacy array format (fallback) or new object format
    let eventsRaw: any[] = [];
    let settingsRaw: any = null;

    if (Array.isArray(parsed)) {
      eventsRaw = parsed;
    } else {
      eventsRaw = parsed.events || parsed.schedule || [];
      settingsRaw = parsed.settings;
    }

    // Validate settings
    let settings: InferredSettings | undefined;
    if (settingsRaw) {
      settings = validateSettings(settingsRaw);
    }

    // Determine effective working hours for validation (use inferred or fallback to very wide range to prevent clipping)
    const validationStart = settings ? settings.workingHoursStart : 0;
    const validationEnd = settings ? settings.workingHoursEnd : 24;

    // Validate and sanitize events
    const validatedEvents: GeneratedEvent[] = [];
    for (const event of eventsRaw) {
      const validated = validateEvent(event, validationStart, validationEnd);
      if (validated) {
        validatedEvents.push(validated);
      }
    }

    // Resolve Overlaps (Strict enforcement programmatically)
    const resolvedEvents = resolveOverlaps(validatedEvents);

    return {
      events: resolvedEvents,
      settings,
    };
  } catch (error) {
    console.error("DeepSeek API error:", error);
    throw error;
  }
}

/**
 * Validate inferred settings
 */
function validateSettings(raw: any): InferredSettings {
  const validIncrements = [5, 15, 30, 60];
  let start =
    typeof raw.workingHoursStart === "number"
      ? Math.max(0, Math.min(23, raw.workingHoursStart))
      : 8;
  let end =
    typeof raw.workingHoursEnd === "number"
      ? Math.max(1, Math.min(24, raw.workingHoursEnd))
      : 18;

  // Ensure start < end
  if (end <= start) end = start + 1;

  return {
    weekStartsOnSunday:
      typeof raw.weekStartsOnSunday === "boolean"
        ? raw.weekStartsOnSunday
        : true,
    use12HourFormat:
      typeof raw.use12HourFormat === "boolean" ? raw.use12HourFormat : true,
    showDates: typeof raw.showDates === "boolean" ? raw.showDates : true,
    workingHoursStart: start,
    workingHoursEnd: end,
    timeIncrement: validIncrements.includes(raw.timeIncrement)
      ? raw.timeIncrement
      : 60,
  };
}

/**
 * Resolve overlapping events by adjusting or removing them
 * Priority: Keep earlier starting events, shorten overlapping later events or move them?
 * Strategy: Sort by time. If overlap, shorten the earlier event to end at later event's start?
 * Actually, prompt asked to "prefer specific". Simple logic: First come first served based on sort.
 */
function resolveOverlaps(events: GeneratedEvent[]): GeneratedEvent[] {
  // 1. Group by day
  const byDay: Record<number, GeneratedEvent[]> = {};
  events.forEach((e) => {
    if (!byDay[e.day]) byDay[e.day] = [];
    byDay[e.day].push(e);
  });

  const result: GeneratedEvent[] = [];

  // 2. Process each day
  Object.keys(byDay).forEach((dayKey) => {
    const dayEvents = byDay[Number(dayKey)];
    // Sort by start time
    dayEvents.sort((a, b) => {
      const startA = a.startHour * 60 + a.startMinute;
      const startB = b.startHour * 60 + b.startMinute;
      return startA - startB;
    });

    const nonOverlapping: GeneratedEvent[] = [];

    for (const current of dayEvents) {
      if (nonOverlapping.length === 0) {
        nonOverlapping.push(current);
        continue;
      }

      const previous = nonOverlapping[nonOverlapping.length - 1];
      const prevEnd = previous.endHour * 60 + previous.endMinute;
      const currStart = current.startHour * 60 + current.startMinute;
      const currEnd = current.endHour * 60 + current.endMinute;

      // Check overlap
      if (currStart < prevEnd) {
        // Overlap detected!
        console.warn(
          `Overlap detected: [${previous.title}] ends ${previous.endHour}:${previous.endMinute} vs [${current.title}] starts ${current.startHour}:${current.startMinute}`,
        );

        // Strategy: Adjust current event to start after previous ends
        // only if it still has duration > 0
        if (currEnd > prevEnd) {
          // Adjust current start to previous end
          const newStartHour = Math.floor(prevEnd / 60);
          const newStartMinute = prevEnd % 60;

          // Create a new object to avoid mutation issues
          const adjusted = {
            ...current,
            startHour: newStartHour,
            startMinute: newStartMinute,
          };
          nonOverlapping.push(adjusted);
        } else {
          // Fully swallowed by previous event. Skip/Discard current.
          // Or prioritize the one with description? Simplicity: Discard current to avoid tiny slice.
        }
      } else {
        nonOverlapping.push(current);
      }
    }
    result.push(...nonOverlapping);
  });

  return result;
}

/**
 * Validate and sanitize a single event
 */
function validateEvent(
  event: unknown,
  minHour: number,
  maxHour: number,
): GeneratedEvent | null {
  if (!event || typeof event !== "object") return null;

  const e = event as Record<string, unknown>;

  // Required fields
  if (typeof e.title !== "string" || !e.title.trim()) return null;
  if (typeof e.day !== "number" || e.day < 0 || e.day > 6) return null;

  // Strict Input Validation (OpenAI/DeepSeek might output 24:00 which needs handling)
  let sHour = typeof e.startHour === "number" ? e.startHour : -1;
  let sMin = typeof e.startMinute === "number" ? e.startMinute : 0;
  let eHour = typeof e.endHour === "number" ? e.endHour : -1;
  let eMin = typeof e.endMinute === "number" ? e.endMinute : 0;

  if (sHour < 0 || sHour > 23) return null; // Start must be 0-23

  // End hour 24 is valid (meaning 00:00 next day), effectively midnight
  if (eHour < 0 || eHour > 24) return null;
  if (eHour === 24 && eMin > 0) {
    // Cap at 24:00
    eMin = 0;
  }

  // Ensure within permitted bounds (e.g. inferred working hours)
  // Relaxation: We strictly allow 0-24, but if we want to enforce working hours, we do it here.
  // The previous code clamped events. Here we perform a soft check or just clamp.
  // Given requirement "No events out of timeline bounds" -> this means if the timeline is 8-18, an event at 19 is invisible/invalid.
  // But since we are INFERRING the timeline, the timeline should adapt to the events.
  // So the validation here should purely be "Is it a valid time of day?"

  // Correction: "Time axis range" (referring to item #3 in user request) implies the UI view.
  // If the event is at 20:00 but view is 8:00-18:00, it's "out of bounds".
  // Therefore, the inferred settings MUST cover these events.
  // So here we valid against 0-24 solely.

  // Minute defaults
  sMin = Math.max(0, Math.min(59, sMin));
  eMin = Math.max(0, Math.min(59, eMin));

  if (eHour === 24) {
    eHour = 24;
    eMin = 0;
  } // Normalize midnight end

  // Ensure end is after start
  const startTotal = sHour * 60 + sMin;
  const endTotal = eHour * 60 + eMin;

  if (endTotal <= startTotal) {
    // Fix by adding 1 hour default
    eHour = sHour + 1;
    if (eHour > 24) {
      eHour = 24;
      eMin = 0;
    }
    // If still invalid (e.g. start was 23:30), cap at 24:00
    if (eHour * 60 + eMin <= startTotal) return null; // Can't fix, discard
  }

  // Validate color
  const color: EventColor = VALID_COLORS.includes(e.color as EventColor)
    ? (e.color as EventColor)
    : "blue";

  return {
    title: e.title.trim().substring(0, 100),
    description:
      typeof e.description === "string"
        ? e.description.trim().substring(0, 500)
        : "",
    day: e.day as number,
    startHour: sHour,
    startMinute: sMin,
    endHour: eHour,
    endMinute: eMin,
    color,
  };
}
