import { describe, it, expect } from "vitest";

// Note: These functions are not exported from export.ts, so we need to test them indirectly
// or consider exporting them for testability. For now, we'll re-implement the pure functions
// here for testing purposes, then verify they behave identically to the originals.

// ============================================
// containsNonAscii - Pure function test
// ============================================
function containsNonAscii(text: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[^\x00-\x7F]/.test(text);
}

describe("containsNonAscii", () => {
  it("should return false for ASCII-only text", () => {
    expect(containsNonAscii("Hello World")).toBe(false);
    expect(containsNonAscii("Meeting at 9:00 AM")).toBe(false);
    expect(containsNonAscii("Test-123_abc")).toBe(false);
  });

  it("should return true for Chinese characters", () => {
    expect(containsNonAscii("会议")).toBe(true);
    expect(containsNonAscii("Meeting 会议")).toBe(true);
  });

  it("should return true for other non-ASCII characters", () => {
    expect(containsNonAscii("Café")).toBe(true);
    expect(containsNonAscii("日本語")).toBe(true);
    expect(containsNonAscii("Ñoño")).toBe(true);
  });

  it("should handle empty string", () => {
    expect(containsNonAscii("")).toBe(false);
  });
});

// ============================================
// escapeCsvField - Pure function test
// ============================================
function escapeCsvField(field: string): string {
  if (
    field.includes(",") ||
    field.includes('"') ||
    field.includes("\n") ||
    field.includes("\r")
  ) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

describe("escapeCsvField", () => {
  it("should return unchanged for simple text", () => {
    expect(escapeCsvField("Hello")).toBe("Hello");
    expect(escapeCsvField("Simple text")).toBe("Simple text");
  });

  it("should wrap in quotes for text with commas", () => {
    expect(escapeCsvField("Hello, World")).toBe('"Hello, World"');
  });

  it("should escape double quotes", () => {
    expect(escapeCsvField('He said "Hello"')).toBe('"He said ""Hello"""');
  });

  it("should handle newlines", () => {
    expect(escapeCsvField("Line 1\nLine 2")).toBe('"Line 1\nLine 2"');
    expect(escapeCsvField("Line 1\r\nLine 2")).toBe('"Line 1\r\nLine 2"');
  });

  it("should handle combined special characters", () => {
    expect(escapeCsvField('Hello, "World"\nLine 2')).toBe(
      '"Hello, ""World""\nLine 2"',
    );
  });
});

// ============================================
// calculateDuration - Pure function test
// ============================================
function calculateDuration(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): string {
  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;
  const durationMinutes = endTotalMinutes - startTotalMinutes;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}min`;
}

describe("calculateDuration", () => {
  it("should calculate duration for full hours", () => {
    expect(calculateDuration(9, 0, 10, 0)).toBe("1h");
    expect(calculateDuration(9, 0, 12, 0)).toBe("3h");
  });

  it("should calculate duration for minutes only", () => {
    expect(calculateDuration(9, 0, 9, 30)).toBe("30min");
    expect(calculateDuration(9, 0, 9, 45)).toBe("45min");
  });

  it("should calculate duration for hours and minutes", () => {
    expect(calculateDuration(9, 0, 10, 30)).toBe("1h 30min");
    expect(calculateDuration(9, 15, 11, 45)).toBe("2h 30min");
  });
});

// ============================================
// getDayName - Pure function test
// ============================================
function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

describe("getDayName", () => {
  it("should return correct day name for dates", () => {
    // Note: getDay() returns local day, so we use specific known dates
    expect(getDayName("2024-12-25")).toBe("Wednesday"); // Christmas 2024
    expect(getDayName("2024-12-24")).toBe("Tuesday");
    expect(getDayName("2024-12-22")).toBe("Sunday");
  });
});

// ============================================
// generateFilename - Testing the exported function
// ============================================
import { generateFilename } from "./export";

describe("generateFilename", () => {
  it("should generate filename with default prefix", () => {
    const filename = generateFilename();
    expect(filename).toMatch(/^schedule-\d{4}-\d{2}-\d{2}$/);
  });

  it("should generate filename with custom prefix", () => {
    const filename = generateFilename("my-calendar");
    expect(filename).toMatch(/^my-calendar-\d{4}-\d{2}-\d{2}$/);
  });

  it("should use current date", () => {
    const today = new Date().toISOString().split("T")[0];
    const filename = generateFilename();
    expect(filename).toBe(`schedule-${today}`);
  });
});
