import { describe, it, expect } from "vitest";
import {
  doTimesOverlap,
  findConflictingEvents,
  formatEventTimeRange,
  wouldDragConflict,
} from "./event-conflict";
import type { Event } from "./types";

// Helper to create test events
const createEvent = (
  id: string,
  date: string,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
): Event => ({
  id,
  title: `Event ${id}`,
  description: "",
  date,
  day: 1,
  startHour,
  startMinute,
  endHour,
  endMinute,
  color: "blue",
});

// ============================================
// doTimesOverlap tests
// ============================================
describe("doTimesOverlap", () => {
  it("should return true for overlapping times", () => {
    // Event 1: 9:00 - 11:00
    // Event 2: 10:00 - 12:00
    expect(doTimesOverlap(9, 0, 11, 0, 10, 0, 12, 0)).toBe(true);
  });

  it("should return false for non-overlapping times", () => {
    // Event 1: 9:00 - 10:00
    // Event 2: 11:00 - 12:00
    expect(doTimesOverlap(9, 0, 10, 0, 11, 0, 12, 0)).toBe(false);
  });

  it("should return false for adjacent times (no overlap)", () => {
    // Event 1: 9:00 - 10:00
    // Event 2: 10:00 - 11:00 (touching but not overlapping)
    expect(doTimesOverlap(9, 0, 10, 0, 10, 0, 11, 0)).toBe(false);
  });

  it("should return true when one event contains another", () => {
    // Event 1: 9:00 - 12:00
    // Event 2: 10:00 - 11:00 (inside event 1)
    expect(doTimesOverlap(9, 0, 12, 0, 10, 0, 11, 0)).toBe(true);
  });

  it("should handle minute-level precision", () => {
    // Event 1: 9:30 - 10:30
    // Event 2: 10:15 - 11:00 (overlaps by 15 minutes)
    expect(doTimesOverlap(9, 30, 10, 30, 10, 15, 11, 0)).toBe(true);
  });

  it("should return false for minute-level non-overlap", () => {
    // Event 1: 9:00 - 10:00
    // Event 2: 10:01 - 11:00 (1 minute gap)
    expect(doTimesOverlap(9, 0, 10, 0, 10, 1, 11, 0)).toBe(false);
  });
});

// ============================================
// findConflictingEvents tests
// ============================================
describe("findConflictingEvents", () => {
  const existingEvents: Event[] = [
    createEvent("1", "2025-01-15", 9, 0, 10, 0),
    createEvent("2", "2025-01-15", 11, 0, 12, 0),
    createEvent("3", "2025-01-16", 9, 0, 10, 0), // Different date
  ];

  it("should find conflicting events on same date", () => {
    const newEvent = {
      title: "New",
      description: "",
      date: "2025-01-15",
      day: 1,
      startHour: 9,
      startMinute: 30,
      endHour: 10,
      endMinute: 30,
      color: "blue" as const,
    };
    const conflicts = findConflictingEvents(newEvent, existingEvents);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].id).toBe("1");
  });

  it("should return empty array for non-conflicting event", () => {
    const newEvent = {
      title: "New",
      description: "",
      date: "2025-01-15",
      day: 1,
      startHour: 14,
      startMinute: 0,
      endHour: 15,
      endMinute: 0,
      color: "blue" as const,
    };
    const conflicts = findConflictingEvents(newEvent, existingEvents);
    expect(conflicts).toHaveLength(0);
  });

  it("should not conflict with events on different dates", () => {
    const newEvent = {
      title: "New",
      description: "",
      date: "2025-01-17", // Different date
      day: 1,
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
      color: "blue" as const,
    };
    const conflicts = findConflictingEvents(newEvent, existingEvents);
    expect(conflicts).toHaveLength(0);
  });

  it("should exclude specified event ID (for editing)", () => {
    const newEvent = {
      title: "Edited",
      description: "",
      date: "2025-01-15",
      day: 1,
      startHour: 9,
      startMinute: 0,
      endHour: 10,
      endMinute: 0,
      color: "blue" as const,
    };
    // Exclude event '1' - should not find conflicts
    const conflicts = findConflictingEvents(newEvent, existingEvents, "1");
    expect(conflicts).toHaveLength(0);
  });

  it("should find multiple conflicts", () => {
    const newEvent = {
      title: "Long event",
      description: "",
      date: "2025-01-15",
      day: 1,
      startHour: 8,
      startMinute: 0,
      endHour: 13,
      endMinute: 0, // Overlaps with events 1 and 2
      color: "blue" as const,
    };
    const conflicts = findConflictingEvents(newEvent, existingEvents);
    expect(conflicts).toHaveLength(2);
  });
});

// ============================================
// formatEventTimeRange tests
// ============================================
describe("formatEventTimeRange", () => {
  const event = createEvent("1", "2025-01-15", 9, 30, 14, 15);

  it("should format in 12-hour format by default", () => {
    expect(formatEventTimeRange(event)).toBe("9:30 AM - 2:15 PM");
  });

  it("should format in 12-hour format when specified", () => {
    expect(formatEventTimeRange(event, true)).toBe("9:30 AM - 2:15 PM");
  });

  it("should format in 24-hour format when specified", () => {
    expect(formatEventTimeRange(event, false)).toBe("09:30 - 14:15");
  });

  it("should handle midnight correctly", () => {
    const midnightEvent = createEvent("2", "2025-01-15", 0, 0, 1, 0);
    expect(formatEventTimeRange(midnightEvent, true)).toBe(
      "12:00 AM - 1:00 AM",
    );
  });

  it("should handle noon correctly", () => {
    const noonEvent = createEvent("3", "2025-01-15", 12, 0, 13, 0);
    expect(formatEventTimeRange(noonEvent, true)).toBe("12:00 PM - 1:00 PM");
  });
});

// ============================================
// wouldDragConflict tests
// ============================================
describe("wouldDragConflict", () => {
  const allEvents: Event[] = [
    createEvent("1", "2025-01-15", 9, 0, 10, 0),
    createEvent("2", "2025-01-15", 11, 0, 12, 0),
    createEvent("3", "2025-01-16", 9, 0, 10, 0),
  ];

  it("should return null when no conflict", () => {
    const draggedEvent = allEvents[0];
    // Moving event 1 to 14:00-15:00
    const conflict = wouldDragConflict(draggedEvent, 14, 0, 15, 0, allEvents);
    expect(conflict).toBeNull();
  });

  it("should return conflicting event when overlap exists", () => {
    const draggedEvent = allEvents[0];
    // Moving event 1 to overlap with event 2 (11:00-12:00)
    const conflict = wouldDragConflict(draggedEvent, 11, 30, 12, 30, allEvents);
    expect(conflict).not.toBeNull();
    expect(conflict?.id).toBe("2");
  });

  it("should not conflict with itself", () => {
    const draggedEvent = allEvents[0];
    // Moving event 1 within its own time range should not conflict
    const conflict = wouldDragConflict(draggedEvent, 9, 15, 10, 15, allEvents);
    expect(conflict).toBeNull();
  });

  it("should only check conflicts on same date", () => {
    const draggedEvent = allEvents[0];
    // Event 3 is on a different date (2025-01-16)
    // Moving event 1 to 9:00-10:00 should not conflict with event 3
    const conflict = wouldDragConflict(draggedEvent, 9, 0, 10, 0, allEvents);
    expect(conflict).toBeNull();
  });
});
