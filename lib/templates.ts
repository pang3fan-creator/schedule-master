import type { Event, EventColor } from "@/lib/types"

export interface TemplateData {
    slug: string
    title: string
    description: string
    longDescription: string
    category: string
    icon?: string // Icon name for UI display
    requiresPro?: boolean // Whether this template requires Pro subscription
    events: Omit<Event, "id" | "date">[] // Events without id/date, will be generated dynamically
    settings?: {
        weekStartsOnSunday?: boolean
        use12HourFormat?: boolean
        workingHoursStart?: number
        workingHoursEnd?: number
        timeIncrement?: 5 | 10 | 15 | 30 | 60 // Time increment in minutes
    }
    faq?: {
        question: string
        answer: string
    }[]
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
    builderType?: string
): Omit<Event, "id" | "date"> => ({
    title,
    description,
    day,
    startHour,
    startMinute,
    endHour,
    endMinute,
    color,
    builderType,
})

export const TEMPLATES: Record<string, TemplateData> = {
    // ============================================
    // PRD Keyword Template 1: Employee Schedule Builder
    // ============================================
    "employee-schedule-builder": {
        slug: "employee-schedule-builder",
        title: "Employee Schedule Builder",
        description: "Create and manage employee work schedules with ease. Perfect for managers and HR professionals.",
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
        },
        events: [
            // Monday
            createEvent("John - Morning", "Front desk", 0, 6, 0, 14, 0, "blue"),
            createEvent("Sarah - Afternoon", "Front desk", 0, 14, 0, 22, 0, "green"),
            // Tuesday
            createEvent("Mike - Morning", "Warehouse", 1, 6, 0, 14, 0, "orange"),
            createEvent("Lisa - Afternoon", "Warehouse", 1, 14, 0, 22, 0, "purple"),
            // Wednesday
            createEvent("John - Morning", "Front desk", 2, 6, 0, 14, 0, "blue"),
            createEvent("Mike - Afternoon", "Front desk", 2, 14, 0, 22, 0, "orange"),
            // Thursday
            createEvent("Sarah - Morning", "Customer Service", 3, 6, 0, 14, 0, "green"),
            createEvent("Lisa - Afternoon", "Customer Service", 3, 14, 0, 22, 0, "purple"),
            // Friday
            createEvent("All Staff Meeting", "Conference Room", 4, 9, 0, 10, 0, "red"),
            createEvent("John - Day Shift", "Front desk", 4, 10, 0, 18, 0, "blue"),
        ],
        faq: [
            {
                question: "How do I add employees to the schedule?",
                answer: "Simply click on any time slot in the calendar to create a new event. Enter the employee's name and assign them to a specific shift. You can also drag existing events to move them around.",
            },
            {
                question: "Can I create recurring weekly schedules?",
                answer: "Yes! Once you set up your weekly schedule, it's saved in your browser. You can export it as an image and use it as a template for future weeks.",
            },
            {
                question: "How do I share the schedule with my team?",
                answer: "Click the 'Export' button to download your schedule as a PNG or JPG image. You can then share it via email, print it, or post it in your workplace.",
            },
            {
                question: "Is this employee scheduling tool really free?",
                answer: "Yes, the basic schedule builder is completely free. You can create schedules, add employees, and export as images with a watermark. Upgrade to Pro for watermark-free exports and PDF downloads.",
            },
        ],
    },

    // ============================================
    // PRD Keyword Template 2: College Class Schedule Builder
    // ============================================
    "college-class-schedule-builder": {
        slug: "college-class-schedule-builder",
        title: "College Class Schedule Builder",
        description: "Plan your college semester with our easy-to-use class schedule planner. Perfect for students.",
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
        },
        events: [
            // Monday
            createEvent("Calculus 101", "Room 201 - Prof. Smith", 0, 8, 0, 9, 30, "blue"),
            createEvent("Physics Lab", "Science Building 305", 0, 10, 0, 12, 0, "green"),
            createEvent("Lunch Break", "Student Center", 0, 12, 0, 13, 0, "yellow"),
            createEvent("English Composition", "Humanities 102", 0, 14, 0, 15, 30, "purple"),
            // Tuesday
            createEvent("Chemistry", "Science Building 201", 1, 9, 0, 10, 30, "orange"),
            createEvent("Study Group", "Library", 1, 11, 0, 12, 0, "teal"),
            createEvent("Lunch Break", "Student Center", 1, 12, 0, 13, 0, "yellow"),
            createEvent("History", "Humanities 305", 1, 14, 0, 15, 30, "red"),
            // Wednesday
            createEvent("Calculus 101", "Room 201 - Prof. Smith", 2, 8, 0, 9, 30, "blue"),
            createEvent("Computer Science", "Tech Building 101", 2, 10, 0, 11, 30, "pink"),
            createEvent("Lunch Break", "Student Center", 2, 12, 0, 13, 0, "yellow"),
            createEvent("Office Hours", "Prof. Smith's Office", 2, 15, 0, 16, 0, "blue"),
            // Thursday
            createEvent("Chemistry Lab", "Science Building 310", 3, 9, 0, 12, 0, "orange"),
            createEvent("Lunch Break", "Student Center", 3, 12, 0, 13, 0, "yellow"),
            createEvent("English Composition", "Humanities 102", 3, 14, 0, 15, 30, "purple"),
            // Friday
            createEvent("Calculus 101", "Room 201 - Prof. Smith", 4, 8, 0, 9, 30, "blue"),
            createEvent("Physics Lecture", "Science Building 101", 4, 10, 0, 11, 30, "green"),
        ],
        faq: [
            {
                question: "How do I add my classes to the schedule?",
                answer: "Click on any time slot to create a new class block. Enter the course name, room number, and professor information. Drag the edges to adjust the duration.",
            },
            {
                question: "Can I color-code different subjects?",
                answer: "Absolutely! Each class block can be assigned a different color. We recommend using one color per subject to quickly visualize your schedule at a glance.",
            },
            {
                question: "Does this work for college and university schedules?",
                answer: "Yes! The schedule builder works for any educational institution. It features 15-minute time increments and a Monday-Friday view that's perfect for academic schedules.",
            },
            {
                question: "Can I plan for multiple semesters?",
                answer: "You can export your current schedule as an image, then clear the calendar and create a new schedule for the next semester. Each schedule is saved in your browser.",
            },
        ],
    },

    // ============================================
    // PRD Keyword Template 3: Workout Schedule Builder
    // ============================================
    "workout-schedule-builder": {
        slug: "workout-schedule-builder",
        title: "Workout Schedule Builder",
        description: "Plan your weekly fitness routine with our visual workout planner. Great for gym-goers and fitness enthusiasts.",
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
        },
        events: [
            // Sunday (Day 0 when weekStartsOnSunday)
            createEvent("Rest Day", "Active recovery, stretching", 0, 8, 0, 9, 0, "teal"),
            createEvent("Light Walk", "30 min outdoor walk", 0, 17, 0, 17, 30, "green"),
            // Monday
            createEvent("Chest & Triceps", "Bench press, dips, pushups", 1, 6, 0, 7, 30, "red"),
            createEvent("Protein Meal", "Post-workout nutrition", 1, 8, 0, 8, 30, "yellow"),
            createEvent("Evening Cardio", "20 min light jog", 1, 18, 0, 18, 30, "green"),
            // Tuesday
            createEvent("Back & Biceps", "Pull-ups, rows, curls", 2, 6, 0, 7, 30, "blue"),
            createEvent("Protein Meal", "Post-workout nutrition", 2, 8, 0, 8, 30, "yellow"),
            createEvent("Yoga", "45 min flexibility session", 2, 17, 30, 18, 15, "teal"),
            // Wednesday
            createEvent("Cardio", "30 min running + HIIT", 3, 6, 0, 7, 0, "green"),
            createEvent("Stretching", "15 min flexibility", 3, 7, 0, 7, 30, "teal"),
            createEvent("Core Workout", "Abs and planks", 3, 18, 0, 18, 30, "purple"),
            // Thursday
            createEvent("Legs & Core", "Squats, lunges, planks", 4, 6, 0, 7, 30, "purple"),
            createEvent("Protein Meal", "Post-workout nutrition", 4, 8, 0, 8, 30, "yellow"),
            createEvent("Recovery Walk", "Light 30 min walk", 4, 17, 0, 17, 30, "green"),
            // Friday
            createEvent("Shoulders & Arms", "OHP, lateral raises", 5, 6, 0, 7, 30, "orange"),
            createEvent("Protein Meal", "Post-workout nutrition", 5, 8, 0, 8, 30, "yellow"),
            createEvent("Stretch & Foam Roll", "Recovery session", 5, 18, 0, 18, 30, "teal"),
            // Saturday
            createEvent("Full Body Cardio", "Swimming or cycling", 6, 8, 0, 9, 30, "green"),
            createEvent("Meal Prep", "Prepare week's meals", 6, 11, 0, 13, 0, "pink"),
            createEvent("Outdoor Activity", "Hiking or sports", 6, 15, 0, 17, 0, "green"),
        ],
        faq: [
            {
                question: "How do I create a push-pull-legs routine?",
                answer: "Simply add workout blocks for each day. Use colors to represent different muscle groups: red for push (chest/shoulders/triceps), blue for pull (back/biceps), and purple for legs. Schedule rest days between intense sessions.",
            },
            {
                question: "Can I add rest days to my workout schedule?",
                answer: "Yes! Create a block labeled 'Rest Day' or 'Active Recovery' to remind yourself when to take a break. Rest is crucial for muscle recovery and growth.",
            },
            {
                question: "How do I track cardio and strength training separately?",
                answer: "Use different colors for cardio (we suggest green) and strength training (red, blue, etc.). This visual distinction helps you balance your weekly routine.",
            },
            {
                question: "Can I save my workout plan for the gym?",
                answer: "Export your schedule as an image and save it to your phone. You can reference it at the gym without needing internet access.",
            },
        ],
    },

    // ============================================
    // PRD Keyword Template 4: Visual Schedule Builder
    // ============================================
    "visual-schedule-builder": {
        slug: "visual-schedule-builder",
        title: "Visual Schedule Builder",
        description: "Create beautiful, color-coded visual schedules. Perfect for visual learners and creative planners.",
        longDescription: `Transform your schedule from a boring list into a beautiful visual masterpiece. Our Free Visual Schedule Builder uses colors, blocks, and intuitive design to help you see your week at a glance.

Perfect for visual learners, creative professionals, and anyone who prefers seeing their schedule rather than reading it. The drag-and-drop interface makes it easy to arrange and rearrange your plans, while the color-coding system helps you instantly identify different types of activities.

Whether you're planning a creative project, managing multiple clients, or organizing your personal life, this visual approach to scheduling helps you spot conflicts, find free time, and maintain balance across all areas of your life.`,
        category: "Visual",
        icon: "Palette",
        settings: {
            weekStartsOnSunday: true,
            use12HourFormat: true,
            workingHoursStart: 7,
            workingHoursEnd: 20,
            timeIncrement: 30,
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
            createEvent("Lunch Meeting", "Client discussion", 3, 12, 0, 14, 0, "purple"),
            createEvent("Social Media", "Content creation", 3, 15, 0, 17, 0, "green"),
            // Thursday
            createEvent("Workshop", "Teaching session", 4, 10, 0, 13, 0, "red"),
            createEvent("Personal Time", "Self-care", 4, 15, 0, 17, 0, "teal"),
            // Friday
            createEvent("Project Review", "Team sync", 5, 9, 0, 10, 30, "blue"),
            createEvent("Creative Work", "Finish projects", 5, 11, 0, 15, 0, "pink"),
        ],
        faq: [
            {
                question: "Why use a visual schedule instead of a regular calendar?",
                answer: "Visual schedules use colors and blocks to help you see patterns in your week instantly. This is especially helpful for visual learners, creatives, and anyone who struggles with traditional text-based calendars.",
            },
            {
                question: "How many colors can I use?",
                answer: "We offer 10 distinct colors to help you categorize different types of activities. Use consistent colors for similar tasks (e.g., blue for meetings, pink for creative work) to build visual habits.",
            },
            {
                question: "Can I create a schedule for my kids or students?",
                answer: "Absolutely! Visual schedules are especially effective for children. Use bright, distinct colors and simple labels to create routines they can follow independently.",
            },
            {
                question: "How do I make my schedule look more professional?",
                answer: "Stick to 3-4 complementary colors, use consistent naming conventions, and export as a high-quality image. Pro users can remove the watermark for a cleaner look.",
            },
        ],
    },

    // ============================================
    // PRD Keyword Template 5: AI Schedule Generator
    // ============================================
    "ai-schedule-generator": {
        slug: "ai-schedule-generator",
        title: "AI Schedule Generator",
        description: "Let AI help you create the perfect schedule. Smart scheduling powered by intelligent algorithms.",
        longDescription: `Experience the future of scheduling with our AI-powered Schedule Generator. Using smart algorithms, this tool helps you create optimized schedules that balance work, rest, and personal time.

Simply tell the AI what you need to accomplish, and watch as it generates a color-coded weekly plan tailored to your needs. Our intelligent system considers factors like energy levels throughout the day, task dependencies, and the importance of breaks to create schedules that actually work.

Whether you're a busy professional trying to maximize productivity, a student balancing classes and extracurriculars, or anyone looking for a smarter way to plan their week, our AI Schedule Generator takes the guesswork out of scheduling.`,
        category: "AI",
        icon: "Sparkles",
        requiresPro: true,
        settings: {
            weekStartsOnSunday: false,
            use12HourFormat: true,
            workingHoursStart: 8,
            workingHoursEnd: 18,
            timeIncrement: 15,
        },
        events: [
            // AI-optimized schedule example
            // Monday - High energy morning tasks
            createEvent("Deep Work Block", "AI suggests: tackle complex tasks", 0, 9, 0, 11, 30, "blue"),
            createEvent("Break", "AI suggests: step away from screen", 0, 11, 30, 12, 0, "teal"),
            createEvent("Lunch", "AI suggests: healthy meal", 0, 12, 0, 13, 0, "yellow"),
            createEvent("Meetings", "AI suggests: schedule calls post-lunch", 0, 14, 0, 16, 0, "purple"),
            // Tuesday
            createEvent("Creative Tasks", "AI suggests: morning creativity peak", 1, 9, 0, 12, 0, "pink"),
            createEvent("Lunch", "AI suggests: light meal", 1, 12, 0, 13, 0, "yellow"),
            createEvent("Admin Work", "AI suggests: low-energy task time", 1, 14, 0, 16, 0, "green"),
            // Wednesday
            createEvent("Deep Work Block", "AI suggests: mid-week focus", 2, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "AI suggests: social lunch", 2, 12, 0, 13, 0, "yellow"),
            createEvent("Team Sync", "AI suggests: collaboration time", 2, 14, 0, 15, 0, "orange"),
            createEvent("Learning", "AI suggests: skill development", 2, 15, 30, 17, 0, "red"),
            // Thursday
            createEvent("Project Work", "AI suggests: execution day", 3, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "AI suggests: meal prep day", 3, 12, 0, 13, 0, "yellow"),
            createEvent("Review & Plan", "AI suggests: mid-week check", 3, 14, 0, 15, 30, "purple"),
            // Friday
            createEvent("Priority Tasks", "AI suggests: finish key items", 4, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "AI suggests: team lunch", 4, 12, 0, 13, 0, "yellow"),
            createEvent("Week Review", "AI suggests: reflect & plan", 4, 14, 0, 15, 0, "orange"),
            createEvent("Flex Time", "AI suggests: catch up or early finish", 4, 15, 0, 17, 0, "teal"),
        ],
        faq: [
            {
                question: "How does the AI schedule generator work?",
                answer: "Our AI uses smart algorithms to analyze optimal scheduling patterns. It considers factors like task complexity, energy levels throughout the day, and the importance of breaks to suggest a balanced schedule.",
            },
            {
                question: "Can I customize the AI-generated schedule?",
                answer: "Absolutely! The AI-generated schedule is just a starting point. You can drag, resize, edit, and delete any blocks to perfectly match your needs. Think of it as a smart template.",
            },
            {
                question: "Will AI replace my personal scheduling decisions?",
                answer: "No, the AI serves as a helpful assistant, not a replacement. It provides suggestions based on productivity research and best practices, but you always have full control over your schedule.",
            },
            {
                question: "Is the AI scheduling feature free?",
                answer: "Yes! You can use the AI-generated template for free. The schedule is fully editable and can be exported as an image. Pro features include advanced AI customization and PDF export.",
            },
        ],
    },
}

export function getTemplate(slug: string): TemplateData | undefined {
    return TEMPLATES[slug]
}

export function getAllTemplateSlugs(): string[] {
    return Object.keys(TEMPLATES)
}

export function getAllTemplates(): TemplateData[] {
    return Object.values(TEMPLATES)
}
