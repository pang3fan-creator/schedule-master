import { describe, it, expect } from "vitest";
import {
  formatHour,
  formatTime,
  formatDateString,
  getWeekStart,
  getWeekDates,
  getIsoDayIndex,
  formatDateRange,
  getEventPosition,
  calculateDraggedTime,
  parseTimeString,
  minutesToTime,
  timeToMinutes,
  groupOverlappingEvents,
  DEFAULT_MIN_HOUR,
  DEFAULT_MAX_HOUR,
} from "./time-utils";
import type { Event } from "./types";

// ============================================
// formatHour tests
// ============================================
describe("formatHour", () => {
  describe("12-hour format", () => {
    it("should format midnight as 12:00 AM", () => {
      expect(formatHour(0, true)).toBe("12:00 AM");
    });

    it("should format noon as 12:00 PM", () => {
      expect(formatHour(12, true)).toBe("12:00 PM");
    });

    it("should format morning hours correctly", () => {
      expect(formatHour(1, true)).toBe("1:00 AM");
      expect(formatHour(9, true)).toBe("9:00 AM");
      expect(formatHour(11, true)).toBe("11:00 AM");
    });

    it("should format afternoon hours correctly", () => {
      expect(formatHour(13, true)).toBe("1:00 PM");
      expect(formatHour(17, true)).toBe("5:00 PM");
      expect(formatHour(23, true)).toBe("11:00 PM");
    });
  });

  describe("24-hour format", () => {
    it("should pad single digit hours", () => {
      expect(formatHour(0, false)).toBe("00:00");
      expect(formatHour(9, false)).toBe("09:00");
    });

    it("should not pad double digit hours", () => {
      expect(formatHour(12, false)).toBe("12:00");
      expect(formatHour(23, false)).toBe("23:00");
    });
  });
});

// ============================================
// formatTime tests
// ============================================
describe("formatTime", () => {
  describe("12-hour format", () => {
    it("should format time with minutes correctly", () => {
      expect(formatTime(9, 30, true)).toBe("9:30 AM");
      expect(formatTime(14, 15, true)).toBe("2:15 PM");
    });

    it("should pad minutes with leading zero", () => {
      expect(formatTime(9, 5, true)).toBe("9:05 AM");
    });

    it("should handle midnight correctly", () => {
      expect(formatTime(0, 30, true)).toBe("12:30 AM");
    });

    it("should handle noon correctly", () => {
      expect(formatTime(12, 0, true)).toBe("12:00 PM");
    });
  });

  describe("24-hour format", () => {
    it("should pad hours and minutes", () => {
      expect(formatTime(9, 5, false)).toBe("09:05");
      expect(formatTime(14, 30, false)).toBe("14:30");
    });
  });
});

// ============================================
// formatDateString tests
// ============================================
describe("formatDateString", () => {
  it("should format date as YYYY-MM-DD", () => {
    const date = new Date(2025, 11, 24); // December 24, 2025
    expect(formatDateString(date)).toBe("2025-12-24");
  });

  it("should pad single digit month and day", () => {
    const date = new Date(2025, 0, 5); // January 5, 2025
    expect(formatDateString(date)).toBe("2025-01-05");
  });
});

// ============================================
// getWeekStart tests
// ============================================
describe("getWeekStart", () => {
  it("should return Monday for week starting on Monday", () => {
    // Wednesday December 25, 2024
    const date = new Date(2024, 11, 25);
    const weekStart = getWeekStart(date, false);
    expect(weekStart.getDay()).toBe(1); // Monday
    expect(weekStart.getDate()).toBe(23);
  });

  it("should return Sunday for week starting on Sunday", () => {
    // Wednesday December 25, 2024
    const date = new Date(2024, 11, 25);
    const weekStart = getWeekStart(date, true);
    expect(weekStart.getDay()).toBe(0); // Sunday
    expect(weekStart.getDate()).toBe(22);
  });

  it("should handle Sunday input when week starts on Monday", () => {
    // Sunday December 22, 2024
    const date = new Date(2024, 11, 22);
    const weekStart = getWeekStart(date, false);
    expect(weekStart.getDay()).toBe(1); // Monday
    expect(weekStart.getDate()).toBe(16); // Previous Monday
  });

  it("should reset time to midnight", () => {
    const date = new Date(2024, 11, 25, 14, 30, 45);
    const weekStart = getWeekStart(date, false);
    expect(weekStart.getHours()).toBe(0);
    expect(weekStart.getMinutes()).toBe(0);
    expect(weekStart.getSeconds()).toBe(0);
  });
});

// ============================================
// getWeekDates tests
// ============================================
describe("getWeekDates", () => {
  it("should return 7 dates", () => {
    const weekStart = new Date(2024, 11, 23); // Monday
    const dates = getWeekDates(weekStart);
    expect(dates).toHaveLength(7);
  });

  it("should return consecutive dates", () => {
    const weekStart = new Date(2024, 11, 23);
    const dates = getWeekDates(weekStart);
    for (let i = 0; i < 7; i++) {
      expect(dates[i].getDate()).toBe(23 + i);
    }
  });
});

// ============================================
// getIsoDayIndex tests
// ============================================
describe("getIsoDayIndex", () => {
  it("should return 0 for Monday", () => {
    const monday = new Date(2024, 11, 23);
    expect(getIsoDayIndex(monday)).toBe(0);
  });

  it("should return 6 for Sunday", () => {
    const sunday = new Date(2024, 11, 22);
    expect(getIsoDayIndex(sunday)).toBe(6);
  });

  it("should return correct index for other days", () => {
    const tuesday = new Date(2024, 11, 24);
    const friday = new Date(2024, 11, 27);
    expect(getIsoDayIndex(tuesday)).toBe(1);
    expect(getIsoDayIndex(friday)).toBe(4);
  });
});

// ============================================
// formatDateRange tests
// ============================================
describe("formatDateRange", () => {
  it("should format same month range", () => {
    const start = new Date(2025, 11, 21);
    const end = new Date(2025, 11, 27);
    expect(formatDateRange(start, end)).toBe("December 21 - 27, 2025");
  });

  it("should format cross-month range", () => {
    const start = new Date(2025, 9, 28); // October 28
    const end = new Date(2025, 10, 3); // November 3
    expect(formatDateRange(start, end)).toBe("October 28 - November 3, 2025");
  });

  it("should format cross-year range", () => {
    const start = new Date(2024, 11, 30); // December 30, 2024
    const end = new Date(2025, 0, 5); // January 5, 2025
    expect(formatDateRange(start, end)).toBe(
      "December 30, 2024 - January 5, 2025",
    );
  });
});

// ============================================
// getEventPosition tests
// ============================================
describe("getEventPosition", () => {
  const rowHeight = 60; // 60px per hour

  it("should calculate correct top position", () => {
    const pos = getEventPosition(9, 0, 10, 0, rowHeight, 8);
    expect(pos.top).toBe("60px"); // 1 hour from minHour (8)
  });

  it("should handle half hour offsets", () => {
    const pos = getEventPosition(8, 30, 9, 30, rowHeight, 8);
    expect(pos.top).toBe("30px");
  });

  it("should calculate correct height", () => {
    const pos = getEventPosition(9, 0, 10, 0, rowHeight, 8);
    // 1 hour = 60px, minus 8px = 52px
    expect(pos.height).toBe("52px");
  });

  it("should enforce minimum height of 20px", () => {
    const pos = getEventPosition(9, 0, 9, 5, rowHeight, 8); // 5 minute event
    expect(parseInt(pos.height)).toBeGreaterThanOrEqual(20);
  });
});

// ============================================
// calculateDraggedTime tests
// ============================================
describe("calculateDraggedTime", () => {
  const rowHeight = 60;

  it("should calculate new time after dragging down", () => {
    const result = calculateDraggedTime(
      9,
      0,
      10,
      0, // 9:00-10:00
      60, // 60px = 1 hour down
      rowHeight,
    );
    expect(result.startHour).toBe(10);
    expect(result.endHour).toBe(11);
  });

  it("should calculate new time after dragging up", () => {
    const result = calculateDraggedTime(
      10,
      0,
      11,
      0,
      -60, // 1 hour up
      rowHeight,
    );
    expect(result.startHour).toBe(9);
    expect(result.endHour).toBe(10);
  });

  it("should not allow start before minHour", () => {
    const result = calculateDraggedTime(
      9,
      0,
      10,
      0,
      -300, // 5 hours up (would go to 4:00)
      rowHeight,
      8, // minHour
    );
    expect(result.startHour).toBe(8);
  });

  it("should not allow end after maxHour", () => {
    const result = calculateDraggedTime(
      16,
      0,
      17,
      0,
      120, // 2 hours down (would go to 19:00)
      rowHeight,
      8, // minHour
      17, // maxHour
    );
    expect(result.endHour).toBe(17);
    expect(result.startHour).toBe(16);
  });

  it("should snap to time increment", () => {
    const result = calculateDraggedTime(
      9,
      0,
      10,
      0,
      7, // Small offset
      rowHeight,
      8,
      17,
      15, // 15 minute increment
    );
    expect(result.startMinute % 15).toBe(0);
  });
});

// ============================================
// parseTimeString tests
// ============================================
describe("parseTimeString", () => {
  it("should parse HH:MM format", () => {
    expect(parseTimeString("09:30")).toEqual({ hour: 9, minute: 30 });
    expect(parseTimeString("14:15")).toEqual({ hour: 14, minute: 15 });
  });

  it("should handle single digit hour", () => {
    expect(parseTimeString("9:05")).toEqual({ hour: 9, minute: 5 });
  });

  it("should handle missing values", () => {
    expect(parseTimeString("")).toEqual({ hour: 0, minute: 0 });
  });
});

// ============================================
// minutesToTime tests
// ============================================
describe("minutesToTime", () => {
  it("should convert minutes to hour and minute", () => {
    expect(minutesToTime(90)).toEqual({ hour: 1, minute: 30 });
    expect(minutesToTime(150)).toEqual({ hour: 2, minute: 30 });
  });

  it("should handle zero", () => {
    expect(minutesToTime(0)).toEqual({ hour: 0, minute: 0 });
  });

  it("should handle full hours", () => {
    expect(minutesToTime(120)).toEqual({ hour: 2, minute: 0 });
  });
});

// ============================================
// timeToMinutes tests
// ============================================
describe("timeToMinutes", () => {
  it("should convert hour and minute to total minutes", () => {
    expect(timeToMinutes(2, 30)).toBe(150);
    expect(timeToMinutes(9, 15)).toBe(555);
  });

  it("should handle midnight", () => {
    expect(timeToMinutes(0, 0)).toBe(0);
  });
});

// ============================================
// groupOverlappingEvents tests
// ============================================
describe("groupOverlappingEvents", () => {
  const createTestEvent = (
    id: string,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
  ): Event => ({
    id,
    title: `Event ${id}`,
    description: "",
    date: "2025-01-01",
    day: 1,
    startHour,
    startMinute,
    endHour,
    endMinute,
    color: "blue",
  });

  it("should return empty array for no events", () => {
    expect(groupOverlappingEvents([])).toEqual([]);
  });

  it("should handle single event", () => {
    const events = [createTestEvent("1", 9, 0, 10, 0)];
    const result = groupOverlappingEvents(events);
    expect(result).toHaveLength(1);
    // Width is 98% due to 1% padding on each side (100 - 2 = 98)
    expect(result[0].width).toBe(98);
    expect(result[0].left).toBe(1); // 1% padding from left
  });

  it("should handle non-overlapping events", () => {
    const events = [
      createTestEvent("1", 9, 0, 10, 0),
      createTestEvent("2", 11, 0, 12, 0),
    ];
    const result = groupOverlappingEvents(events);
    expect(result).toHaveLength(2);
    // Non-overlapping events should each have full width (98% with padding)
    expect(result[0].width).toBe(98);
    expect(result[1].width).toBe(98);
  });

  it("should split width for overlapping events", () => {
    const events = [
      createTestEvent("1", 9, 0, 11, 0),
      createTestEvent("2", 10, 0, 12, 0),
    ];
    const result = groupOverlappingEvents(events);
    expect(result).toHaveLength(2);
    // Overlapping events should share width (98% / 2 = 49% each)
    expect(result[0].width).toBe(49);
    expect(result[1].width).toBe(49);
    // First event starts at 1% (left padding), second at 50% (1 + 49)
    expect(result[0].left).toBe(1);
    expect(result[1].left).toBe(50);
  });

  it("should handle three overlapping events", () => {
    const events = [
      createTestEvent("1", 9, 0, 12, 0),
      createTestEvent("2", 10, 0, 11, 0),
      createTestEvent("3", 10, 30, 11, 30),
    ];
    const result = groupOverlappingEvents(events);
    expect(result).toHaveLength(3);
    // All should share width (98% / 3 ≈ 32.67% each)
    result.forEach((event) => {
      expect(event.width).toBeCloseTo(32.67, 1);
    });
  });
});
