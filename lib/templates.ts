import type { Event, EventColor, EventPriority } from "@/lib/types";

export interface TemplateData {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  icon?: string; // Icon name for UI display
  requiresPro?: boolean; // Whether this template requires Pro subscription
  events: Omit<Event, "id" | "date">[]; // Events without id/date, will be generated dynamically
  settings?: {
    weekStartsOnSunday?: boolean;
    use12HourFormat?: boolean;
    workingHoursStart?: number;
    workingHoursEnd?: number;
    timeIncrement?: 5 | 10 | 15 | 30 | 60; // Time increment in minutes
    showDates?: boolean;
  };
}

// Extended event options for templates
interface EventOptions {
  icon?: string;
  task?: {
    isCheckable: boolean;
    isCompleted: boolean;
  };
  priority?: EventPriority;
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
  color: EventColor = "blue",
  options?: EventOptions,
): Omit<Event, "id" | "date"> => ({
  title,
  description,
  day,
  startHour,
  startMinute,
  endHour,
  endMinute,
  color,
  ...options,
});

// Helper for checkable events (cleaning tasks, checklists)
const createCheckableEvent = (
  title: string,
  description: string,
  day: number,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  color: EventColor = "blue",
  icon?: string,
): Omit<Event, "id" | "date"> => ({
  title,
  description,
  day,
  startHour,
  startMinute,
  endHour,
  endMinute,
  color,
  icon,
  task: {
    isCheckable: true,
    isCompleted: false,
  },
});

export const TEMPLATES: Record<string, TemplateData> = {
  // ============================================
  // PRD Keyword Template 1: Employee Schedule Builder
  // ============================================
  "employee-schedule-builder": {
    slug: "employee-schedule-builder",
    title: "Employee Schedule Builder",
    description:
      "Free employee schedule builder for managers. Create and share work schedules with your team in minutes.",
    longDescription: `Managing employee schedules doesn't have to be complicated. Our Free Employee Schedule Builder helps managers and business owners create, organize, and share work schedules in minutes. 

Whether you're running a retail store, restaurant, healthcare facility, or any business with shift workers, this tool makes scheduling simple. Set up morning, afternoon, and night shifts, assign employees to specific time slots, and ensure proper coverage throughout the week.

Key benefits include drag-and-drop scheduling, color-coded shifts for easy visualization, and the ability to export your schedule as an image to share with your team. No more spreadsheet headaches or scheduling conflicts.`,
    category: "Business",
    icon: "Briefcase",
    settings: {
      weekStartsOnSunday: false,
      use12HourFormat: true,
      workingHoursStart: 6,
      workingHoursEnd: 22,
      timeIncrement: 30,
      showDates: false,
    },
    events: [
      // Monday (day 1 when weekStartsOnSunday)
      createEvent("John - Morning", "Front desk", 1, 6, 0, 14, 0, "blue", {
        icon: "Briefcase",
      }),
      createEvent("Sarah - Afternoon", "Front desk", 1, 14, 0, 22, 0, "green", {
        icon: "User",
      }),
      // Tuesday (day 2)
      createEvent("Mike - Morning", "Warehouse", 2, 6, 0, 14, 0, "orange"),
      createEvent("Lisa - Afternoon", "Warehouse", 2, 14, 0, 22, 0, "purple"),
      // Wednesday (day 3)
      createEvent("John - Morning", "Front desk", 3, 6, 0, 14, 0, "blue"),
      createEvent("Mike - Afternoon", "Front desk", 3, 14, 0, 22, 0, "orange"),
      // Thursday (day 4)
      createEvent(
        "Sarah - Morning",
        "Customer Service",
        4,
        6,
        0,
        14,
        0,
        "green",
      ),
      createEvent(
        "Lisa - Afternoon",
        "Customer Service",
        4,
        14,
        0,
        22,
        0,
        "purple",
      ),
      // Friday (day 5)
      createEvent(
        "All Staff Meeting",
        "Conference Room",
        5,
        9,
        0,
        10,
        0,
        "red",
      ),
      createEvent("John - Day Shift", "Front desk", 5, 10, 0, 18, 0, "blue"),
    ],
  },

  // ============================================
  // PRD Keyword Template 2: College Class Schedule Builder
  // ============================================
  "college-class-schedule-builder": {
    slug: "college-class-schedule-builder",
    title: "College Class Schedule Builder",
    description:
      "Free college class schedule builder for students. Plan your semester with our easy-to-use visual planner.",
    longDescription: `Planning your college semester just got easier. Our Free College Class Schedule Builder helps students organize their classes, study sessions, and campus activities in one visual timetable.

Designed specifically for university and college students, this tool features a Monday-Friday view with 15-minute time increments, making it perfect for fitting in those back-to-back lectures and lab sessions.

Use color coding to differentiate between subjects, add room numbers and professor names in the description, and identify gaps in your schedule for study time or campus jobs. Export your schedule to share with roommates or print for your dorm wall.`,
    category: "Education",
    icon: "GraduationCap",
    settings: {
      weekStartsOnSunday: false,
      use12HourFormat: true,
      workingHoursStart: 8,
      workingHoursEnd: 18,
      timeIncrement: 15,
      showDates: true,
    },
    events: [
      // Monday (day 1 when weekStartsOnSunday)
      createEvent(
        "Calculus 101",
        "Room 201 - Prof. Smith",
        1,
        8,
        0,
        9,
        30,
        "blue",
        { icon: "Calculator" },
      ),
      createEvent(
        "Physics Lab",
        "Science Building 305",
        1,
        10,
        0,
        12,
        0,
        "green",
        { icon: "FlaskConical" },
      ),
      createEvent("Lunch Break", "Student Center", 1, 12, 0, 13, 0, "yellow", {
        icon: "Coffee",
      }),
      createEvent(
        "English Composition",
        "Humanities 102",
        1,
        14,
        0,
        15,
        30,
        "purple",
        { icon: "PenTool" },
      ),
      // Tuesday (day 2)
      createEvent(
        "Chemistry",
        "Science Building 201",
        2,
        9,
        0,
        10,
        30,
        "orange",
      ),
      createEvent("Study Group", "Library", 2, 11, 0, 12, 0, "teal"),
      createEvent("Lunch Break", "Student Center", 2, 12, 0, 13, 0, "yellow"),
      createEvent("History", "Humanities 305", 2, 14, 0, 15, 30, "red"),
      // Wednesday (day 3)
      createEvent(
        "Calculus 101",
        "Room 201 - Prof. Smith",
        3,
        8,
        0,
        9,
        30,
        "blue",
      ),
      createEvent(
        "Computer Science",
        "Tech Building 101",
        3,
        10,
        0,
        11,
        30,
        "pink",
      ),
      createEvent("Lunch Break", "Student Center", 3, 12, 0, 13, 0, "yellow"),
      createEvent(
        "Office Hours",
        "Prof. Smith's Office",
        3,
        15,
        0,
        16,
        0,
        "blue",
      ),
      // Thursday (day 4)
      createEvent(
        "Chemistry Lab",
        "Science Building 310",
        4,
        9,
        0,
        12,
        0,
        "orange",
      ),
      createEvent("Lunch Break", "Student Center", 4, 12, 0, 13, 0, "yellow"),
      createEvent(
        "English Composition",
        "Humanities 102",
        4,
        14,
        0,
        15,
        30,
        "purple",
      ),
      // Friday (day 5)
      createEvent(
        "Calculus 101",
        "Room 201 - Prof. Smith",
        5,
        8,
        0,
        9,
        30,
        "blue",
      ),
      createEvent(
        "Physics Lecture",
        "Science Building 101",
        5,
        10,
        0,
        11,
        30,
        "green",
      ),
    ],
  },

  // ============================================
  // PRD Keyword Template 3: Workout Schedule Builder
  // ============================================
  "workout-schedule-builder": {
    slug: "workout-schedule-builder",
    title: "Workout Schedule Builder",
    description:
      "Free workout schedule builder for fitness enthusiasts. Plan your weekly gym routine with our visual planner.",
    longDescription: `Take your fitness journey to the next level with our Free Workout Schedule Builder. Whether you're following a push-pull-legs routine, training for a marathon, or just trying to stay active, this visual planner helps you organize your workouts for the week.

Designed with fitness enthusiasts in mind, this tool lets you schedule specific muscle groups, cardio sessions, rest days, and meal prep times. Color-code your workouts to distinguish between chest day, back day, leg day, and cardio sessions.

Perfect for beginners creating their first workout plan or experienced athletes maintaining complex training schedules. Export your plan and keep it on your phone for quick reference at the gym.`,
    category: "Personal",
    icon: "Dumbbell",
    settings: {
      weekStartsOnSunday: true, // Many workout plans start on Sunday
      use12HourFormat: true,
      workingHoursStart: 5,
      workingHoursEnd: 21,
      timeIncrement: 30,
      showDates: false,
    },
    events: [
      // Sunday (Day 0 when weekStartsOnSunday)
      createEvent(
        "Rest Day",
        "Active recovery, stretching",
        0,
        8,
        0,
        9,
        0,
        "teal",
      ),
      createEvent(
        "Light Walk",
        "30 min outdoor walk",
        0,
        17,
        0,
        17,
        30,
        "green",
      ),
      // Monday
      createEvent(
        "Chest & Triceps",
        "Bench press, dips, pushups",
        1,
        6,
        0,
        7,
        30,
        "red",
        { icon: "Dumbbell" },
      ),
      createEvent(
        "Protein Meal",
        "Post-workout nutrition",
        1,
        8,
        0,
        8,
        30,
        "yellow",
        { icon: "Zap" },
      ),
      createEvent(
        "Evening Cardio",
        "20 min light jog",
        1,
        18,
        0,
        18,
        30,
        "green",
        { icon: "Activity" },
      ),
      // Tuesday
      createEvent(
        "Back & Biceps",
        "Pull-ups, rows, curls",
        2,
        6,
        0,
        7,
        30,
        "blue",
      ),
      createEvent(
        "Protein Meal",
        "Post-workout nutrition",
        2,
        8,
        0,
        8,
        30,
        "yellow",
      ),
      createEvent(
        "Yoga",
        "45 min flexibility session",
        2,
        17,
        30,
        18,
        15,
        "teal",
      ),
      // Wednesday
      createEvent("Cardio", "30 min running + HIIT", 3, 6, 0, 7, 0, "green"),
      createEvent("Stretching", "15 min flexibility", 3, 7, 0, 7, 30, "teal"),
      createEvent("Core Workout", "Abs and planks", 3, 18, 0, 18, 30, "purple"),
      // Thursday
      createEvent(
        "Legs & Core",
        "Squats, lunges, planks",
        4,
        6,
        0,
        7,
        30,
        "purple",
      ),
      createEvent(
        "Protein Meal",
        "Post-workout nutrition",
        4,
        8,
        0,
        8,
        30,
        "yellow",
      ),
      createEvent(
        "Recovery Walk",
        "Light 30 min walk",
        4,
        17,
        0,
        17,
        30,
        "green",
      ),
      // Friday
      createEvent(
        "Shoulders & Arms",
        "OHP, lateral raises",
        5,
        6,
        0,
        7,
        30,
        "orange",
      ),
      createEvent(
        "Protein Meal",
        "Post-workout nutrition",
        5,
        8,
        0,
        8,
        30,
        "yellow",
      ),
      createEvent(
        "Stretch & Foam Roll",
        "Recovery session",
        5,
        18,
        0,
        18,
        30,
        "teal",
      ),
      // Saturday
      createEvent(
        "Full Body Cardio",
        "Swimming or cycling",
        6,
        8,
        0,
        9,
        30,
        "green",
      ),
      createEvent("Meal Prep", "Prepare week's meals", 6, 11, 0, 13, 0, "pink"),
      createEvent(
        "Outdoor Activity",
        "Hiking or sports",
        6,
        15,
        0,
        17,
        0,
        "green",
      ),
    ],
  },

  // ============================================
  // PRD Keyword Template 4: Visual Schedule Builder
  // ============================================
  "visual-schedule-builder": {
    slug: "visual-schedule-builder",
    title: "Visual Schedule Builder",
    description:
      "Free visual schedule builder for creative planners. Create beautiful, color-coded schedules at a glance.",
    longDescription: `Transform your schedule from a boring list into a beautiful visual masterpiece. Our Free Visual Schedule Builder uses colors, blocks, and intuitive design to help you see your week at a glance.

Perfect for visual learners, creative professionals, and anyone who prefers seeing their schedule rather than reading it. The drag-and-drop interface makes it easy to arrange and rearrange your plans, while the color-coding system helps you instantly identify different types of activities.

Whether you're planning a creative project, managing multiple clients, or organizing your personal life, this visual approach to scheduling helps you spot conflicts, find free time, and maintain balance across all areas of your life.`,
    category: "Personal",
    icon: "Palette",
    settings: {
      weekStartsOnSunday: true,
      use12HourFormat: true,
      workingHoursStart: 7,
      workingHoursEnd: 20,
      timeIncrement: 30,
      showDates: false,
    },
    events: [
      // Monday
      createEvent("Creative Work", "Design projects", 1, 9, 0, 12, 0, "pink"),
      createEvent("Lunch", "Break", 1, 12, 0, 13, 0, "yellow"),
      createEvent("Client Calls", "Meetings", 1, 14, 0, 16, 0, "blue"),
      // Tuesday
      createEvent("Admin Tasks", "Emails, planning", 2, 9, 0, 11, 0, "teal"),
      createEvent("Photography", "Outdoor shoot", 2, 13, 0, 17, 0, "orange"),
      // Wednesday
      createEvent("Creative Work", "Illustration", 3, 9, 0, 12, 0, "pink"),
      createEvent(
        "Lunch Meeting",
        "Client discussion",
        3,
        12,
        0,
        14,
        0,
        "purple",
      ),
      createEvent("Social Media", "Content creation", 3, 15, 0, 17, 0, "green"),
      // Thursday
      createEvent("Workshop", "Teaching session", 4, 10, 0, 13, 0, "red"),
      createEvent("Personal Time", "Self-care", 4, 15, 0, 17, 0, "teal"),
      // Friday
      createEvent("Project Review", "Team sync", 5, 9, 0, 10, 30, "blue"),
      createEvent("Creative Work", "Finish projects", 5, 11, 0, 15, 0, "pink"),
    ],
  },

  // ============================================
  // PRD Keyword Template 5: AI Schedule Builder
  // ============================================
  "ai-schedule-builder": {
    slug: "ai-schedule-builder",
    title: "AI Schedule Builder ",
    description:
      "Generate a custom weekly schedule in seconds with AI. Smart, automated scheduling tailored to your productivity, energy levels, and goals.",
    longDescription: `Experience the future of time management with our AI Schedule Builder. Instead of starting with a rigid template, this tool uses advanced algorithms to help you generate an optimized weekly plan from scratch.

Simply apply this template, and our AI Autofill assistant will guide you through creating a schedule that balances deep work, rest, and personal priorities. Our intelligent system considers productivity best practices—like tackling complex tasks during your peak energy hours—to create a routine that actually sticks.

Whether you're a busy founder maximizing output, a student balancing heavy course loads, or anyone looking to reclaim their time, our AI Schedule Generator takes the heavy lifting out of planning your week.`,
    category: "AI",
    icon: "Sparkles",
    requiresPro: true,
    settings: {
      weekStartsOnSunday: false,
      use12HourFormat: false,
      workingHoursStart: 8,
      workingHoursEnd: 18,
      timeIncrement: 15,
      showDates: true,
    },
    events: [
      // Empty - AI will generate the schedule for you!
    ],
  },

  // ============================================
  // PRD Keyword Template 6: Work Shift Schedule Builder
  // ============================================
  "work-shift-schedule-builder": {
    slug: "work-shift-schedule-builder",
    title: "Work Shift Schedule Builder",
    description:
      "Free work shift schedule builder for managers. Build rotating shifts for morning, afternoon, and night crews.",
    longDescription: `Simplify your shift scheduling with our Free Work Shift Schedule Builder. Designed for managers, supervisors, and business owners who need to coordinate rotating work shifts across teams.

Whether you're managing a 24/7 operation, a restaurant with split shifts, a healthcare facility with rotating nurses, or a manufacturing plant with day and night crews, this visual shift planner makes it easy to organize coverage and communicate schedules clearly.

Our intuitive schedule builder features color-coded shifts to distinguish between morning (day), afternoon (swing), and night (graveyard) shifts at a glance. The drag-and-drop interface lets you quickly assign employees, swap shifts, and ensure proper coverage. Highlight overnight shifts in purple for instant visibility, and export your completed roster to share with your team via email or print for the break room.

Stop wrestling with spreadsheets and start building professional shift schedules in minutes.`,
    category: "Business",
    icon: "Briefcase",
    settings: {
      weekStartsOnSunday: true,
      use12HourFormat: false,
      workingHoursStart: 0, // 24/7 coverage view
      workingHoursEnd: 24,
      timeIncrement: 30,
      showDates: true,
    },
    events: [
      // Sunday (Day 0) - Weekend skeleton crew
      createEvent(
        "Night Shift - Team C",
        "Overnight coverage",
        0,
        0,
        0,
        8,
        0,
        "purple",
      ),
      createEvent("Day Shift - Team A", "Morning crew", 0, 8, 0, 16, 0, "blue"),
      createEvent(
        "Swing Shift - Team B",
        "Afternoon/evening",
        0,
        16,
        0,
        24,
        0,
        "orange",
      ),
      // Monday (Day 1)
      createEvent(
        "Night Shift - Team C",
        "Graveyard shift",
        1,
        0,
        0,
        8,
        0,
        "purple",
      ),
      createEvent(
        "Day Shift - Team A",
        "Morning operations",
        1,
        8,
        0,
        16,
        0,
        "blue",
      ),
      createEvent(
        "Swing Shift - Team B",
        "Afternoon/evening",
        1,
        16,
        0,
        24,
        0,
        "orange",
      ),
      // Tuesday (Day 2) - Rotation example
      createEvent(
        "Night Shift - Team A",
        "Rotating to nights",
        2,
        0,
        0,
        8,
        0,
        "purple",
      ),
      createEvent(
        "Day Shift - Team B",
        "Rotating to days",
        2,
        8,
        0,
        16,
        0,
        "blue",
      ),
      createEvent(
        "Swing Shift - Team C",
        "Rotating to swing",
        2,
        16,
        0,
        24,
        0,
        "orange",
      ),
      // Wednesday (Day 3)
      createEvent(
        "Night Shift - Team A",
        "Night crew",
        3,
        0,
        0,
        8,
        0,
        "purple",
      ),
      createEvent("Day Shift - Team B", "Day crew", 3, 8, 0, 16, 0, "blue"),
      createEvent(
        "Swing Shift - Team C",
        "Evening crew",
        3,
        16,
        0,
        24,
        0,
        "orange",
      ),
      // Thursday (Day 4)
      createEvent(
        "Night Shift - Team A",
        "Night crew",
        4,
        0,
        0,
        8,
        0,
        "purple",
      ),
      createEvent("Day Shift - Team B", "Day crew", 4, 8, 0, 16, 0, "blue"),
      createEvent(
        "All-Hands Meeting",
        "Monthly team sync",
        4,
        14,
        0,
        15,
        0,
        "red",
      ),
      createEvent(
        "Swing Shift - Team C",
        "Evening crew",
        4,
        16,
        0,
        24,
        0,
        "orange",
      ),
      // Friday (Day 5)
      createEvent(
        "Night Shift - Team B",
        "Rotating to nights",
        5,
        0,
        0,
        8,
        0,
        "purple",
      ),
      createEvent(
        "Day Shift - Team C",
        "Rotating to days",
        5,
        8,
        0,
        16,
        0,
        "blue",
      ),
      createEvent(
        "Swing Shift - Team A",
        "Rotating to swing",
        5,
        16,
        0,
        24,
        0,
        "orange",
      ),
      // Saturday (Day 6) - Weekend
      createEvent(
        "Night Shift - Team B",
        "Weekend nights",
        6,
        0,
        0,
        8,
        0,
        "purple",
      ),
      createEvent("Day Shift - Team C", "Weekend days", 6, 8, 0, 16, 0, "blue"),
      createEvent(
        "Swing Shift - Team A",
        "Weekend evenings",
        6,
        16,
        0,
        24,
        0,
        "orange",
      ),
    ],
  },

  // ============================================
  // PRD Keyword Template 7: Homeschool Schedule Builder
  // ============================================
  "homeschool-schedule-builder": {
    slug: "homeschool-schedule-builder",
    title: "Homeschool Schedule Builder",
    description:
      "Free homeschool schedule builder for families. Design flexible learning routines that work for your home education journey.",
    longDescription: `Create the perfect homeschool schedule with our Free Homeschool Schedule Builder, designed specifically for home-educating families. Whether you're teaching one child or managing multiple grade levels, this visual planner helps you organize subjects, breaks, and activities into a balanced weekly routine.

Our warm, family-friendly interface makes it easy to plan core subjects like Math, Reading, Science, and History alongside enrichment activities such as Art, Music, and Physical Education. Color-code different subjects for quick visual reference, and schedule regular breaks to keep your children engaged and refreshed.

The flexible design accommodates various homeschool approaches—from structured classical education to relaxed unschooling. Drag and drop to adjust lesson times, add field trips and extracurriculars, or create different schedules for each child. Export your completed schedule to print for the learning space or share digitally with co-op groups and tutors.

Perfect for new homeschool families starting their journey or experienced educators refining their routine. Build a schedule that works for YOUR family, not a one-size-fits-all classroom approach.`,
    category: "Education",
    icon: "Home",
    settings: {
      weekStartsOnSunday: false,
      use12HourFormat: true,
      workingHoursStart: 8,
      workingHoursEnd: 16,
      timeIncrement: 15,
      showDates: false,
    },
    events: [
      // Monday (day 1 when weekStartsOnSunday)
      createEvent(
        "Morning Circle",
        "Calendar, weather, read-aloud",
        1,
        8,
        30,
        9,
        0,
        "yellow",
      ),
      createEvent("Math", "Lesson + practice problems", 1, 9, 0, 10, 0, "blue"),
      createEvent(
        "Snack Break",
        "Healthy snack time",
        1,
        10,
        0,
        10,
        30,
        "teal",
      ),
      createEvent(
        "Reading",
        "Phonics / literature",
        1,
        10,
        30,
        11,
        15,
        "green",
      ),
      createEvent(
        "Science",
        "Hands-on experiments",
        1,
        11,
        15,
        12,
        0,
        "orange",
      ),
      createEvent(
        "Lunch & Free Play",
        "Family lunch break",
        1,
        12,
        0,
        13,
        0,
        "pink",
      ),
      createEvent(
        "Writing",
        "Journal / handwriting",
        1,
        13,
        0,
        13,
        45,
        "purple",
      ),
      createEvent("Art", "Creative projects", 1, 14, 0, 15, 0, "red"),
      // Tuesday (day 2)
      createEvent("Morning Circle", "Daily routine", 2, 8, 30, 9, 0, "yellow"),
      createEvent("Math", "New concepts + review", 2, 9, 0, 10, 0, "blue"),
      createEvent("Snack Break", "Movement break", 2, 10, 0, 10, 30, "teal"),
      createEvent("Reading", "Silent reading time", 2, 10, 30, 11, 15, "green"),
      createEvent("History", "Story of the World", 2, 11, 15, 12, 0, "orange"),
      createEvent("Lunch & Free Play", "Outdoor time", 2, 12, 0, 13, 0, "pink"),
      createEvent("Music", "Instrument practice", 2, 13, 0, 13, 45, "purple"),
      createEvent("PE / Sports", "Physical activity", 2, 14, 0, 15, 0, "red"),
      // Wednesday (day 3)
      createEvent(
        "Morning Circle",
        "Poetry memorization",
        3,
        8,
        30,
        9,
        0,
        "yellow",
      ),
      createEvent("Math", "Games + worksheets", 3, 9, 0, 10, 0, "blue"),
      createEvent("Snack Break", "Reading corner", 3, 10, 0, 10, 30, "teal"),
      createEvent("Reading", "Book discussion", 3, 10, 30, 11, 15, "green"),
      createEvent(
        "Nature Study",
        "Outdoor exploration",
        3,
        11,
        15,
        12,
        30,
        "orange",
      ),
      createEvent(
        "Lunch & Free Play",
        "Picnic if weather permits",
        3,
        12,
        30,
        13,
        30,
        "pink",
      ),
      createEvent(
        "Library Visit",
        "Weekly library trip",
        3,
        14,
        0,
        15,
        30,
        "purple",
      ),
      // Thursday (day 4)
      createEvent(
        "Morning Circle",
        "Calendar activities",
        4,
        8,
        30,
        9,
        0,
        "yellow",
      ),
      createEvent("Math", "Problem solving", 4, 9, 0, 10, 0, "blue"),
      createEvent("Snack Break", "Stretch break", 4, 10, 0, 10, 30, "teal"),
      createEvent(
        "Reading",
        "Reading aloud together",
        4,
        10,
        30,
        11,
        15,
        "green",
      ),
      createEvent(
        "Geography",
        "Map skills + culture",
        4,
        11,
        15,
        12,
        0,
        "orange",
      ),
      createEvent("Lunch & Free Play", "Indoor games", 4, 12, 0, 13, 0, "pink"),
      createEvent("Writing", "Creative writing", 4, 13, 0, 13, 45, "purple"),
      createEvent("Craft Project", "Hands-on making", 4, 14, 0, 15, 0, "red"),
      // Friday (day 5)
      createEvent("Morning Circle", "Week review", 5, 8, 30, 9, 0, "yellow"),
      createEvent("Math", "Math games / review", 5, 9, 0, 10, 0, "blue"),
      createEvent("Snack Break", "Celebration snack", 5, 10, 0, 10, 30, "teal"),
      createEvent("Reading", "Free choice reading", 5, 10, 30, 11, 15, "green"),
      createEvent(
        "Show & Tell",
        "Share what we learned",
        5,
        11,
        15,
        12,
        0,
        "orange",
      ),
      createEvent(
        "Field Trip / Co-op",
        "Group activities",
        5,
        12,
        0,
        15,
        0,
        "pink",
      ),
    ],
  },

  // ============================================
  // PRD Keyword Template 8: Construction Schedule Builder
  // ============================================
  "construction-schedule-builder": {
    slug: "construction-schedule-builder",
    title: "Construction Schedule Builder",
    description:
      "Professional construction schedule builder for contractors and project managers. Plan timelines, track milestones, and manage crews efficiently.",
    longDescription: `Master your construction projects with our Professional Construction Schedule Builder. Designed specifically for general contractors, site managers, and construction teams who need robust timeline management without the complexity of legacy software.

Plan every phase of your build from site preparation to final walkthrough. Our Gantt-style visual approach helps you identify critical paths, manage crew handoffs, and ensure materials arrive exactly when needed.

Key features include phase-based tracking (Demolition, Foundation, Framing, Utilities), resource allocation, and milestone monitoring. The intuitive timeline view allows you to spot potential delays early, coordinate subcontractors effectively, and keep clients updated with professional progress reports.

Perfect for residential builds, renovation projects, and commercial fit-outs. Take control of your job site with a schedule that works as hard as your crew.`,
    category: "Business",
    icon: "HardHat",
    requiresPro: true,
    settings: {
      weekStartsOnSunday: false,
      use12HourFormat: true,
      workingHoursStart: 6,
      workingHoursEnd: 18,
      timeIncrement: 60, // Coarser increment for project phases
      showDates: true,
    },
    events: [
      // Week 1: Site Prep & Foundation
      createEvent(
        "Site Preparation",
        "Excavation and leveling",
        1,
        6,
        0,
        16,
        0,
        "orange",
        { icon: "TrendingUp" },
      ), // Mon
      createEvent(
        "Site Preparation",
        "Excavation and leveling",
        2,
        6,
        0,
        16,
        0,
        "orange",
        { icon: "TrendingUp" },
      ), // Tue
      createEvent(
        "Foundation Forms",
        "Setting concrete forms",
        3,
        7,
        0,
        17,
        0,
        "teal",
        { icon: "Maximize" },
      ), // Wed
      createEvent(
        "Foundation Pour",
        "Concrete truck arrival",
        4,
        7,
        0,
        12,
        0,
        "teal",
        { icon: "Maximize" },
      ), // Thu
      createEvent(
        "Curing Period",
        "No heavy traffic",
        5,
        6,
        0,
        18,
        0,
        "yellow",
        { icon: "Clock" },
      ), // Fri (Work day coverage)

      // Overlapping tasks simulation (Gantt style)
      createEvent(
        "Material Delivery",
        "Lumber package drop",
        4,
        13,
        0,
        15,
        0,
        "blue",
        { icon: "Truck" },
      ), // Thu
      createEvent("Site Meeting", "Owner walkthrough", 5, 9, 0, 10, 0, "red", {
        icon: "Users",
      }), // Fri

      // Weekend Security
      createEvent(
        "Site Security Check",
        "Weekly perimeter check",
        6,
        9,
        0,
        10,
        0,
        "purple",
        { icon: "Shield" },
      ), // Sat
    ],
  },

  // ============================================
  // PRD Keyword Template 9: Cleaning Schedule Builder
  // ============================================
  "cleaning-schedule-builder": {
    slug: "cleaning-schedule-builder",
    title: "Cleaning Schedule Builder",
    description:
      "Free printable cleaning schedule builder for households. Create chore charts and cleaning routines for your family or roommates.",
    longDescription: `Keep your home sparkling clean with our Free Cleaning Schedule Builder. Whether you're a busy parent managing household chores, roommates splitting cleaning duties, or anyone who wants to stay on top of housework, this visual planner makes cleaning manageable and organized.

Our checklist-style schedule builder helps you break down cleaning tasks into daily, weekly, and monthly routines. Assign specific tasks to different days, rotate responsibilities among household members, and never forget about those easy-to-miss deep cleaning jobs.

Color-code tasks by room (kitchen, bathroom, bedroom, living room) or by person for shared living situations. The visual format makes it easy to see who's responsible for what and when. Export your cleaning schedule as a printable checklist to hang on the fridge or share digitally with roommates.

Perfect for establishing cleaning routines, teaching kids responsibility, coordinating with a cleaning service, or maintaining a peaceful, clutter-free living space. A clean home starts with a good plan!`,
    category: "Personal",
    icon: "SprayCan",
    settings: {
      weekStartsOnSunday: true,
      use12HourFormat: true,
      workingHoursStart: 7,
      workingHoursEnd: 21,
      timeIncrement: 30,
      showDates: false,
    },
    events: [
      // Sunday (day 0) - Weekly deep clean
      createCheckableEvent(
        "Weekly Laundry",
        "Wash, dry, fold all clothes",
        0,
        9,
        0,
        11,
        0,
        "blue",
        "WashingMachine",
      ),
      createCheckableEvent(
        "Change Bed Sheets",
        "All bedrooms",
        0,
        11,
        0,
        12,
        0,
        "purple",
        "Bed",
      ),
      createCheckableEvent(
        "Meal Prep & Kitchen Deep Clean",
        "Clean appliances, organize fridge",
        0,
        14,
        0,
        16,
        0,
        "green",
        "ChefHat",
      ),
      // Monday (day 1)
      createCheckableEvent(
        "Morning Tidy",
        "Make beds, quick pickup",
        1,
        7,
        0,
        7,
        30,
        "yellow",
      ),
      createCheckableEvent(
        "Kitchen Clean",
        "Dishes, wipe counters, sweep",
        1,
        19,
        0,
        19,
        30,
        "green",
        "Utensils",
      ),
      createCheckableEvent(
        "Take Out Trash",
        "All rooms",
        1,
        20,
        0,
        20,
        30,
        "red",
        "Trash2",
      ),
      // Tuesday (day 2)
      createCheckableEvent(
        "Morning Tidy",
        "Make beds, quick pickup",
        2,
        7,
        0,
        7,
        30,
        "yellow",
      ),
      createCheckableEvent(
        "Bathroom Clean",
        "Scrub toilet, sink, mirror",
        2,
        19,
        0,
        19,
        45,
        "teal",
        "Bath",
      ),
      createCheckableEvent(
        "Vacuum Living Room",
        "Floors and rugs",
        2,
        20,
        0,
        20,
        30,
        "orange",
      ),
      // Wednesday (day 3)
      createCheckableEvent(
        "Morning Tidy",
        "Make beds, quick pickup",
        3,
        7,
        0,
        7,
        30,
        "yellow",
      ),
      createCheckableEvent(
        "Kitchen Clean",
        "Dishes, wipe counters",
        3,
        19,
        0,
        19,
        30,
        "green",
        "Utensils",
      ),
      createCheckableEvent(
        "Dust Surfaces",
        "Living room & bedrooms",
        3,
        20,
        0,
        20,
        30,
        "pink",
      ),
      // Thursday (day 4)
      createCheckableEvent(
        "Morning Tidy",
        "Make beds, quick pickup",
        4,
        7,
        0,
        7,
        30,
        "yellow",
      ),
      createCheckableEvent(
        "Mop Floors",
        "Kitchen & bathroom",
        4,
        19,
        0,
        19,
        45,
        "blue",
      ),
      createCheckableEvent(
        "Wipe Appliances",
        "Microwave, stovetop",
        4,
        20,
        0,
        20,
        30,
        "green",
      ),
      // Friday (day 5)
      createCheckableEvent(
        "Morning Tidy",
        "Make beds, quick pickup",
        5,
        7,
        0,
        7,
        30,
        "yellow",
      ),
      createCheckableEvent(
        "Quick Bathroom Wipe",
        "Sink and mirror",
        5,
        19,
        0,
        19,
        30,
        "teal",
      ),
      createCheckableEvent(
        "Vacuum Bedrooms",
        "All bedroom floors",
        5,
        19,
        30,
        20,
        0,
        "orange",
      ),
      createCheckableEvent(
        "Take Out Trash",
        "Trash day prep",
        5,
        20,
        0,
        20,
        30,
        "red",
        "Trash2",
      ),
      // Saturday (day 6)
      createCheckableEvent(
        "Deep Clean Task",
        "Rotate: windows, baseboards, etc.",
        6,
        10,
        0,
        11,
        30,
        "purple",
        "Sparkles",
      ),
      createCheckableEvent(
        "Organize & Declutter",
        "One room focus",
        6,
        14,
        0,
        15,
        30,
        "pink",
        "FolderOpen",
      ),
      createCheckableEvent(
        "Grocery & Restock",
        "Cleaning supplies check",
        6,
        16,
        0,
        17,
        0,
        "blue",
        "ShoppingCart",
      ),
    ],
  },
};

import { TEMPLATE_TRANSLATIONS_ES } from "./templates-translations";

export function getTemplate(
  slug: string,
  locale: string = "en",
): TemplateData | undefined {
  const template = TEMPLATES[slug];
  if (!template) return undefined;

  if (locale === "es") {
    const translation = TEMPLATE_TRANSLATIONS_ES[slug];
    if (translation) {
      const { events: transEvents, ...restTrans } = translation;
      const merged = { ...template, ...restTrans };

      // Merge events if translated events exist
      if (transEvents && template.events) {
        merged.events = template.events.map((evt, i) => {
          const transEvt = transEvents[i];
          return transEvt ? { ...evt, ...transEvt } : evt;
        });
      }
      return merged;
    }
  }

  return template;
}

export function getAllTemplateSlugs(): string[] {
  return Object.keys(TEMPLATES);
}

export function getAllTemplates(locale: string = "en"): TemplateData[] {
  const slugs = getAllTemplateSlugs();
  return slugs.map((slug) => getTemplate(slug, locale)!);
}
