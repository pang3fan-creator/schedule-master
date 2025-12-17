import type { Event, EventColor } from "@/lib/types"

export interface TemplateData {
    slug: string
    title: string
    description: string
    longDescription: string
    category: string
    events: Omit<Event, "id" | "date">[] // Events without id/date, will be generated dynamically
    settings?: {
        weekStartsOnSunday?: boolean
        use12HourFormat?: boolean
        workingHoursStart?: number
        workingHoursEnd?: number
    }
}

// Helper to create consistent event structure
const createEvent = (
    title: string,
    description: string,
    day: number,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
    color: EventColor = "blue"
): Omit<Event, "id" | "date"> => ({
    title,
    description,
    day,
    startHour,
    startMinute,
    endHour,
    endMinute,
    color,
})

export const TEMPLATES: Record<string, TemplateData> = {
    "weekly-work-schedule": {
        slug: "weekly-work-schedule",
        title: "Weekly Work Schedule",
        description: "Perfect for managing employee shifts and work hours",
        longDescription: "A comprehensive weekly schedule template designed for businesses to manage employee work hours, shifts, and breaks. Includes morning meetings, lunch breaks, and end-of-day reports.",
        category: "Business",
        settings: {
            weekStartsOnSunday: false, // Business weeks typically start Monday
            use12HourFormat: true,
            workingHoursStart: 8,
            workingHoursEnd: 17,
        },
        events: [
            createEvent("Morning Standup", "Team sync meeting", 0, 9, 0, 9, 30, "blue"),
            createEvent("Work Block", "Deep work time", 0, 9, 30, 12, 0, "green"),
            createEvent("Lunch Break", "1 hour break", 0, 12, 0, 13, 0, "yellow"),
            createEvent("Afternoon Tasks", "Project work", 0, 13, 0, 16, 0, "green"),
            createEvent("Daily Report", "End of day summary", 0, 16, 0, 16, 30, "purple"),

            createEvent("Morning Standup", "Team sync meeting", 1, 9, 0, 9, 30, "blue"),
            createEvent("Work Block", "Deep work time", 1, 9, 30, 12, 0, "green"),
            createEvent("Lunch Break", "1 hour break", 1, 12, 0, 13, 0, "yellow"),
            createEvent("Team Meeting", "Weekly planning", 1, 14, 0, 15, 0, "blue"),
            createEvent("Afternoon Tasks", "Project work", 1, 15, 0, 16, 30, "green"),

            createEvent("Morning Standup", "Team sync meeting", 2, 9, 0, 9, 30, "blue"),
            createEvent("Work Block", "Deep work time", 2, 9, 30, 12, 0, "green"),
            createEvent("Lunch Break", "1 hour break", 2, 12, 0, 13, 0, "yellow"),
            createEvent("Afternoon Tasks", "Project work", 2, 13, 0, 16, 30, "green"),

            createEvent("Morning Standup", "Team sync meeting", 3, 9, 0, 9, 30, "blue"),
            createEvent("Work Block", "Deep work time", 3, 9, 30, 12, 0, "green"),
            createEvent("Lunch Break", "1 hour break", 3, 12, 0, 13, 0, "yellow"),
            createEvent("1:1 Meeting", "Manager sync", 3, 14, 0, 14, 30, "purple"),
            createEvent("Afternoon Tasks", "Project work", 3, 14, 30, 16, 30, "green"),

            createEvent("Morning Standup", "Team sync meeting", 4, 9, 0, 9, 30, "blue"),
            createEvent("Work Block", "Deep work time", 4, 9, 30, 12, 0, "green"),
            createEvent("Lunch Break", "1 hour break", 4, 12, 0, 13, 0, "yellow"),
            createEvent("Week Review", "Accomplishments review", 4, 15, 0, 16, 0, "blue"),
        ],
    },

    "class-timetable": {
        slug: "class-timetable",
        title: "Class Timetable",
        description: "Organize your academic schedule with ease",
        longDescription: "A student-friendly timetable template for organizing classes, study sessions, and extracurricular activities. Perfect for high school and college students.",
        category: "Education",
        settings: {
            weekStartsOnSunday: false,
            use12HourFormat: true,
            workingHoursStart: 8,
            workingHoursEnd: 17,
        },
        events: [
            createEvent("Mathematics", "Room 101", 0, 8, 0, 9, 30, "blue"),
            createEvent("Physics", "Lab 201", 0, 10, 0, 11, 30, "green"),
            createEvent("Lunch", "Cafeteria", 0, 12, 0, 13, 0, "yellow"),
            createEvent("English", "Room 105", 0, 13, 30, 15, 0, "purple"),

            createEvent("Chemistry", "Lab 202", 1, 8, 0, 9, 30, "orange"),
            createEvent("History", "Room 103", 1, 10, 0, 11, 30, "red"),
            createEvent("Lunch", "Cafeteria", 1, 12, 0, 13, 0, "yellow"),
            createEvent("Art", "Studio A", 1, 14, 0, 15, 30, "pink"),

            createEvent("Mathematics", "Room 101", 2, 8, 0, 9, 30, "blue"),
            createEvent("Biology", "Lab 203", 2, 10, 0, 11, 30, "teal"),
            createEvent("Lunch", "Cafeteria", 2, 12, 0, 13, 0, "yellow"),
            createEvent("Study Hall", "Library", 2, 14, 0, 16, 0, "green"),

            createEvent("Physics", "Lab 201", 3, 8, 0, 9, 30, "green"),
            createEvent("English", "Room 105", 3, 10, 0, 11, 30, "purple"),
            createEvent("Lunch", "Cafeteria", 3, 12, 0, 13, 0, "yellow"),
            createEvent("PE", "Gymnasium", 3, 14, 0, 15, 30, "red"),

            createEvent("Chemistry", "Lab 202", 4, 8, 0, 9, 30, "orange"),
            createEvent("Mathematics", "Room 101", 4, 10, 0, 11, 30, "blue"),
            createEvent("Lunch", "Cafeteria", 4, 12, 0, 13, 0, "yellow"),
            createEvent("Club Activity", "Various", 4, 15, 0, 16, 30, "pink"),
        ],
    },

    "team-meeting-planner": {
        slug: "team-meeting-planner",
        title: "Team Meeting Planner",
        description: "Coordinate team meetings and availability",
        longDescription: "Streamline your team's meeting schedule with dedicated blocks for standups, planning sessions, and collaborative work time.",
        category: "Business",
        settings: {
            weekStartsOnSunday: false,
            use12HourFormat: true,
            workingHoursStart: 9,
            workingHoursEnd: 17,
        },
        events: [
            createEvent("Sprint Planning", "Plan 2-week sprint", 0, 9, 0, 11, 0, "blue"),
            createEvent("Lunch", "Break", 0, 12, 0, 13, 0, "yellow"),
            createEvent("Design Review", "UI/UX feedback", 0, 14, 0, 15, 0, "purple"),

            createEvent("Daily Standup", "15 min sync", 1, 9, 0, 9, 15, "green"),
            createEvent("Focus Time", "No meetings", 1, 9, 30, 12, 0, "teal"),
            createEvent("Lunch", "Break", 1, 12, 0, 13, 0, "yellow"),
            createEvent("Tech Discussion", "Architecture", 1, 15, 0, 16, 0, "blue"),

            createEvent("Daily Standup", "15 min sync", 2, 9, 0, 9, 15, "green"),
            createEvent("Focus Time", "No meetings", 2, 9, 30, 12, 0, "teal"),
            createEvent("Lunch", "Break", 2, 12, 0, 13, 0, "yellow"),
            createEvent("All Hands", "Company meeting", 2, 14, 0, 15, 0, "red"),

            createEvent("Daily Standup", "15 min sync", 3, 9, 0, 9, 15, "green"),
            createEvent("Focus Time", "No meetings", 3, 9, 30, 12, 0, "teal"),
            createEvent("Lunch", "Break", 3, 12, 0, 13, 0, "yellow"),
            createEvent("1:1s", "Personal check-ins", 3, 14, 0, 16, 0, "purple"),

            createEvent("Daily Standup", "15 min sync", 4, 9, 0, 9, 15, "green"),
            createEvent("Sprint Review", "Demo & feedback", 4, 10, 0, 11, 0, "blue"),
            createEvent("Lunch", "Break", 4, 12, 0, 13, 0, "yellow"),
            createEvent("Retrospective", "Team retro", 4, 14, 0, 15, 0, "orange"),
        ],
    },

    "personal-routine": {
        slug: "personal-routine",
        title: "Personal Routine",
        description: "Build healthy habits with a structured daily routine",
        longDescription: "Create a balanced daily routine that includes exercise, work, meals, and personal time. Perfect for building healthy habits and maintaining work-life balance.",
        category: "Personal",
        settings: {
            weekStartsOnSunday: true, // Personal schedules often start on Sunday
            use12HourFormat: true,
            workingHoursStart: 6,
            workingHoursEnd: 22,
        },
        events: [
            // Monday
            createEvent("Morning Workout", "Gym session", 1, 6, 0, 7, 0, "red"),
            createEvent("Breakfast", "Healthy meal", 1, 7, 30, 8, 0, "yellow"),
            createEvent("Work", "Focus time", 1, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "Meal break", 1, 12, 0, 13, 0, "yellow"),
            createEvent("Work", "Afternoon tasks", 1, 13, 0, 17, 0, "blue"),

            // Tuesday
            createEvent("Morning Run", "Cardio", 2, 6, 0, 6, 45, "red"),
            createEvent("Breakfast", "Healthy meal", 2, 7, 30, 8, 0, "yellow"),
            createEvent("Work", "Focus time", 2, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "Meal break", 2, 12, 0, 13, 0, "yellow"),
            createEvent("Work", "Afternoon tasks", 2, 13, 0, 17, 0, "blue"),

            // Wednesday
            createEvent("Yoga", "Stretch & relax", 3, 6, 30, 7, 15, "pink"),
            createEvent("Breakfast", "Healthy meal", 3, 7, 30, 8, 0, "yellow"),
            createEvent("Work", "Focus time", 3, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "Meal break", 3, 12, 0, 13, 0, "yellow"),
            createEvent("Work", "Afternoon tasks", 3, 13, 0, 17, 0, "blue"),

            // Thursday  
            createEvent("Morning Workout", "Gym session", 4, 6, 0, 7, 0, "red"),
            createEvent("Breakfast", "Healthy meal", 4, 7, 30, 8, 0, "yellow"),
            createEvent("Work", "Focus time", 4, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "Meal break", 4, 12, 0, 13, 0, "yellow"),
            createEvent("Work", "Afternoon tasks", 4, 13, 0, 17, 0, "blue"),

            // Friday
            createEvent("Morning Run", "Cardio", 5, 6, 0, 6, 45, "red"),
            createEvent("Breakfast", "Healthy meal", 5, 7, 30, 8, 0, "yellow"),
            createEvent("Work", "Focus time", 5, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "Meal break", 5, 12, 0, 13, 0, "yellow"),
            createEvent("Half Day", "Early finish", 5, 13, 0, 15, 0, "green"),
        ],
    },

    "shift-rotation": {
        slug: "shift-rotation",
        title: "Shift Rotation",
        description: "Manage rotating shifts for 24/7 operations",
        longDescription: "A template for managing rotating work shifts across multiple time periods. Ideal for healthcare, manufacturing, and service industries.",
        category: "Business",
        settings: {
            weekStartsOnSunday: false,
            use12HourFormat: true,
            workingHoursStart: 6,
            workingHoursEnd: 22,
        },
        events: [
            createEvent("Morning Shift", "Team A", 0, 6, 0, 14, 0, "blue"),
            createEvent("Afternoon Shift", "Team B", 0, 14, 0, 22, 0, "green"),

            createEvent("Morning Shift", "Team A", 1, 6, 0, 14, 0, "blue"),
            createEvent("Afternoon Shift", "Team B", 1, 14, 0, 22, 0, "green"),

            createEvent("Morning Shift", "Team B", 2, 6, 0, 14, 0, "green"),
            createEvent("Afternoon Shift", "Team A", 2, 14, 0, 22, 0, "blue"),

            createEvent("Morning Shift", "Team B", 3, 6, 0, 14, 0, "green"),
            createEvent("Afternoon Shift", "Team A", 3, 14, 0, 22, 0, "blue"),

            createEvent("Morning Shift", "Team A", 4, 6, 0, 14, 0, "blue"),
            createEvent("Afternoon Shift", "Team B", 4, 14, 0, 22, 0, "green"),
        ],
    },

    "event-calendar": {
        slug: "event-calendar",
        title: "Event Calendar",
        description: "Plan and track upcoming events and deadlines",
        longDescription: "Track important events, deadlines, and appointments throughout the week. Great for project managers and event coordinators.",
        category: "Personal",
        settings: {
            weekStartsOnSunday: true,
            use12HourFormat: true,
            workingHoursStart: 8,
            workingHoursEnd: 18,
        },
        events: [
            createEvent("Project Kickoff", "New initiative", 1, 10, 0, 11, 30, "blue"),
            createEvent("Client Call", "Status update", 1, 14, 0, 15, 0, "purple"),

            createEvent("Workshop", "Team training", 2, 9, 0, 12, 0, "green"),
            createEvent("Deadline", "Report due", 2, 17, 0, 17, 30, "red"),

            createEvent("Presentation", "Quarterly review", 3, 10, 0, 11, 0, "orange"),
            createEvent("Team Lunch", "Celebration", 3, 12, 0, 13, 30, "yellow"),

            createEvent("Interview", "New hire", 4, 9, 0, 10, 0, "teal"),
            createEvent("Webinar", "Industry trends", 4, 14, 0, 15, 30, "pink"),

            createEvent("Week Wrap-up", "Summary & planning", 5, 16, 0, 17, 0, "blue"),
        ],
    },
}

export function getTemplate(slug: string): TemplateData | undefined {
    return TEMPLATES[slug]
}

export function getAllTemplateSlugs(): string[] {
    return Object.keys(TEMPLATES)
}
