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
    color: EventColor = "blue"
): Omit<Event, "id" | "date"> => ({
    title,
    description,
    day,
    startHour,
    startMinute,
    endHour,
    endMinute,
    color
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
            weekStartsOnSunday: true,
            use12HourFormat: true,
            workingHoursStart: 6,
            workingHoursEnd: 22,
            timeIncrement: 30,
        },
        events: [
            // Monday (day 1 when weekStartsOnSunday)
            createEvent("John - Morning", "Front desk", 1, 6, 0, 14, 0, "blue"),
            createEvent("Sarah - Afternoon", "Front desk", 1, 14, 0, 22, 0, "green"),
            // Tuesday (day 2)
            createEvent("Mike - Morning", "Warehouse", 2, 6, 0, 14, 0, "orange"),
            createEvent("Lisa - Afternoon", "Warehouse", 2, 14, 0, 22, 0, "purple"),
            // Wednesday (day 3)
            createEvent("John - Morning", "Front desk", 3, 6, 0, 14, 0, "blue"),
            createEvent("Mike - Afternoon", "Front desk", 3, 14, 0, 22, 0, "orange"),
            // Thursday (day 4)
            createEvent("Sarah - Morning", "Customer Service", 4, 6, 0, 14, 0, "green"),
            createEvent("Lisa - Afternoon", "Customer Service", 4, 14, 0, 22, 0, "purple"),
            // Friday (day 5)
            createEvent("All Staff Meeting", "Conference Room", 5, 9, 0, 10, 0, "red"),
            createEvent("John - Day Shift", "Front desk", 5, 10, 0, 18, 0, "blue"),
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
            weekStartsOnSunday: true,
            use12HourFormat: true,
            workingHoursStart: 8,
            workingHoursEnd: 18,
            timeIncrement: 15,
        },
        events: [
            // Monday (day 1 when weekStartsOnSunday)
            createEvent("Calculus 101", "Room 201 - Prof. Smith", 1, 8, 0, 9, 30, "blue"),
            createEvent("Physics Lab", "Science Building 305", 1, 10, 0, 12, 0, "green"),
            createEvent("Lunch Break", "Student Center", 1, 12, 0, 13, 0, "yellow"),
            createEvent("English Composition", "Humanities 102", 1, 14, 0, 15, 30, "purple"),
            // Tuesday (day 2)
            createEvent("Chemistry", "Science Building 201", 2, 9, 0, 10, 30, "orange"),
            createEvent("Study Group", "Library", 2, 11, 0, 12, 0, "teal"),
            createEvent("Lunch Break", "Student Center", 2, 12, 0, 13, 0, "yellow"),
            createEvent("History", "Humanities 305", 2, 14, 0, 15, 30, "red"),
            // Wednesday (day 3)
            createEvent("Calculus 101", "Room 201 - Prof. Smith", 3, 8, 0, 9, 30, "blue"),
            createEvent("Computer Science", "Tech Building 101", 3, 10, 0, 11, 30, "pink"),
            createEvent("Lunch Break", "Student Center", 3, 12, 0, 13, 0, "yellow"),
            createEvent("Office Hours", "Prof. Smith's Office", 3, 15, 0, 16, 0, "blue"),
            // Thursday (day 4)
            createEvent("Chemistry Lab", "Science Building 310", 4, 9, 0, 12, 0, "orange"),
            createEvent("Lunch Break", "Student Center", 4, 12, 0, 13, 0, "yellow"),
            createEvent("English Composition", "Humanities 102", 4, 14, 0, 15, 30, "purple"),
            // Friday (day 5)
            createEvent("Calculus 101", "Room 201 - Prof. Smith", 5, 8, 0, 9, 30, "blue"),
            createEvent("Physics Lecture", "Science Building 101", 5, 10, 0, 11, 30, "green"),
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
    // PRD Keyword Template 5: AI Schedule Builder
    // ============================================
    "ai-schedule-builder": {
        slug: "ai-schedule-builder",
        title: "AI Schedule Builder",
        description: "Let AI help you create the perfect schedule. Smart scheduling powered by intelligent algorithms.",
        longDescription: `Experience the future of scheduling with our AI-powered Schedule Builder. Using smart algorithms, this tool helps you create optimized schedules that balance work, rest, and personal time.

Simply tell the AI what you need to accomplish, and watch as it generates a color-coded weekly plan tailored to your needs. Our intelligent system considers factors like energy levels throughout the day, task dependencies, and the importance of breaks to create schedules that actually work.

Whether you're a busy professional trying to maximize productivity, a student balancing classes and extracurriculars, or anyone looking for a smarter way to plan their week, our AI Schedule Builder takes the guesswork out of scheduling.`,
        category: "AI",
        icon: "Sparkles",
        requiresPro: true,
        settings: {
            weekStartsOnSunday: true,
            use12HourFormat: true,
            workingHoursStart: 8,
            workingHoursEnd: 18,
            timeIncrement: 15,
        },
        events: [
            // AI-optimized schedule example
            // Monday (day 1 when weekStartsOnSunday) - High energy morning tasks
            createEvent("Deep Work Block", "AI suggests: tackle complex tasks", 1, 9, 0, 11, 30, "blue"),
            createEvent("Break", "AI suggests: step away from screen", 1, 11, 30, 12, 0, "teal"),
            createEvent("Lunch", "AI suggests: healthy meal", 1, 12, 0, 13, 0, "yellow"),
            createEvent("Meetings", "AI suggests: schedule calls post-lunch", 1, 14, 0, 16, 0, "purple"),
            // Tuesday (day 2)
            createEvent("Creative Tasks", "AI suggests: morning creativity peak", 2, 9, 0, 12, 0, "pink"),
            createEvent("Lunch", "AI suggests: light meal", 2, 12, 0, 13, 0, "yellow"),
            createEvent("Admin Work", "AI suggests: low-energy task time", 2, 14, 0, 16, 0, "green"),
            // Wednesday (day 3)
            createEvent("Deep Work Block", "AI suggests: mid-week focus", 3, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "AI suggests: social lunch", 3, 12, 0, 13, 0, "yellow"),
            createEvent("Team Sync", "AI suggests: collaboration time", 3, 14, 0, 15, 0, "orange"),
            createEvent("Learning", "AI suggests: skill development", 3, 15, 0, 17, 0, "red"),
            // Thursday (day 4)
            createEvent("Project Work", "AI suggests: execution day", 4, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "AI suggests: meal prep day", 4, 12, 0, 13, 0, "yellow"),
            createEvent("Review & Plan", "AI suggests: mid-week check", 4, 14, 0, 15, 30, "purple"),
            // Friday (day 5)
            createEvent("Priority Tasks", "AI suggests: finish key items", 5, 9, 0, 12, 0, "blue"),
            createEvent("Lunch", "AI suggests: team lunch", 5, 12, 0, 13, 0, "yellow"),
            createEvent("Week Review", "AI suggests: reflect & plan", 5, 14, 0, 15, 0, "orange"),
            createEvent("Flex Time", "AI suggests: catch up or early finish", 5, 15, 0, 17, 0, "teal"),
        ],
        faq: [
            {
                question: "How does the AI schedule builder work?",
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

    // ============================================
    // PRD Keyword Template 6: Work Shift Schedule Builder
    // ============================================
    "work-shift-schedule-builder": {
        slug: "work-shift-schedule-builder",
        title: "Work Shift Schedule Builder",
        description: "Build rotating work shifts with ease. Perfect for managers scheduling morning, afternoon, and night shifts.",
        longDescription: `Simplify your shift scheduling with our Free Work Shift Schedule Builder. Designed for managers, supervisors, and business owners who need to coordinate rotating work shifts across teams.

Whether you're managing a 24/7 operation, a restaurant with split shifts, a healthcare facility with rotating nurses, or a manufacturing plant with day and night crews, this visual shift planner makes it easy to organize coverage and communicate schedules clearly.

Our intuitive schedule builder features color-coded shifts to distinguish between morning (day), afternoon (swing), and night (graveyard) shifts at a glance. The drag-and-drop interface lets you quickly assign employees, swap shifts, and ensure proper coverage. Highlight overnight shifts in purple for instant visibility, and export your completed roster to share with your team via email or print for the break room.

Stop wrestling with spreadsheets and start building professional shift schedules in minutes.`,
        category: "Business",
        icon: "Briefcase",
        settings: {
            weekStartsOnSunday: true,
            use12HourFormat: true,
            workingHoursStart: 0,  // 24/7 coverage view
            workingHoursEnd: 24,
            timeIncrement: 30,
        },
        events: [
            // Sunday (Day 0) - Weekend skeleton crew
            createEvent("Night Shift - Team C", "Overnight coverage", 0, 0, 0, 8, 0, "purple"),
            createEvent("Day Shift - Team A", "Morning crew", 0, 8, 0, 16, 0, "blue"),
            createEvent("Swing Shift - Team B", "Afternoon/evening", 0, 16, 0, 24, 0, "orange"),
            // Monday (Day 1)
            createEvent("Night Shift - Team C", "Graveyard shift", 1, 0, 0, 8, 0, "purple"),
            createEvent("Day Shift - Team A", "Morning operations", 1, 8, 0, 16, 0, "blue"),
            createEvent("Swing Shift - Team B", "Afternoon/evening", 1, 16, 0, 24, 0, "orange"),
            // Tuesday (Day 2) - Rotation example
            createEvent("Night Shift - Team A", "Rotating to nights", 2, 0, 0, 8, 0, "purple"),
            createEvent("Day Shift - Team B", "Rotating to days", 2, 8, 0, 16, 0, "blue"),
            createEvent("Swing Shift - Team C", "Rotating to swing", 2, 16, 0, 24, 0, "orange"),
            // Wednesday (Day 3)
            createEvent("Night Shift - Team A", "Night crew", 3, 0, 0, 8, 0, "purple"),
            createEvent("Day Shift - Team B", "Day crew", 3, 8, 0, 16, 0, "blue"),
            createEvent("Swing Shift - Team C", "Evening crew", 3, 16, 0, 24, 0, "orange"),
            // Thursday (Day 4)
            createEvent("Night Shift - Team A", "Night crew", 4, 0, 0, 8, 0, "purple"),
            createEvent("Day Shift - Team B", "Day crew", 4, 8, 0, 16, 0, "blue"),
            createEvent("All-Hands Meeting", "Monthly team sync", 4, 14, 0, 15, 0, "red"),
            createEvent("Swing Shift - Team C", "Evening crew", 4, 16, 0, 24, 0, "orange"),
            // Friday (Day 5)
            createEvent("Night Shift - Team B", "Rotating to nights", 5, 0, 0, 8, 0, "purple"),
            createEvent("Day Shift - Team C", "Rotating to days", 5, 8, 0, 16, 0, "blue"),
            createEvent("Swing Shift - Team A", "Rotating to swing", 5, 16, 0, 24, 0, "orange"),
            // Saturday (Day 6) - Weekend
            createEvent("Night Shift - Team B", "Weekend nights", 6, 0, 0, 8, 0, "purple"),
            createEvent("Day Shift - Team C", "Weekend days", 6, 8, 0, 16, 0, "blue"),
            createEvent("Swing Shift - Team A", "Weekend evenings", 6, 16, 0, 24, 0, "orange"),
        ],
        faq: [
            {
                question: "How do I set up rotating shifts for my team?",
                answer: "Create shift blocks for each team and assign them to different time slots across the week. Use our drag-and-drop interface to rotate teams through day, swing, and night shifts. Color-code each team for instant visibility.",
            },
            {
                question: "Can I highlight night shifts differently?",
                answer: "Yes! We recommend using purple or dark colors for night/graveyard shifts to make them stand out. This helps employees quickly identify overnight assignments on the schedule.",
            },
            {
                question: "How do I handle 24/7 shift coverage?",
                answer: "Set the working hours to cover the full day (our shift template is pre-configured for this). Create three 8-hour shift blocks: Day (8am-4pm), Swing (4pm-12am), and Night (12am-8am) to ensure continuous coverage.",
            },
            {
                question: "Can I create split shifts or irregular schedules?",
                answer: "Absolutely! Simply create multiple shift blocks for the same employee on the same day. For example, a restaurant split shift might have blocks from 11am-2pm and 5pm-10pm.",
            },
            {
                question: "How do I share the shift schedule with my team?",
                answer: "Click Export to download your shift schedule as a PNG or JPG image. Share it via email, team messaging apps, or print it for the break room. Pro users can export as PDF for professional printing.",
            },
        ],
    },

    // ============================================
    // PRD Keyword Template 7: Homeschool Schedule Builder
    // ============================================
    "homeschool-schedule-builder": {
        slug: "homeschool-schedule-builder",
        title: "Homeschool Schedule Builder",
        description: "Design flexible homeschool schedules for your family. Perfect for home-educating parents who want a structured yet adaptable learning plan.",
        longDescription: `Create the perfect homeschool schedule with our Free Homeschool Schedule Builder, designed specifically for home-educating families. Whether you're teaching one child or managing multiple grade levels, this visual planner helps you organize subjects, breaks, and activities into a balanced weekly routine.

Our warm, family-friendly interface makes it easy to plan core subjects like Math, Reading, Science, and History alongside enrichment activities such as Art, Music, and Physical Education. Color-code different subjects for quick visual reference, and schedule regular breaks to keep your children engaged and refreshed.

The flexible design accommodates various homeschool approaches—from structured classical education to relaxed unschooling. Drag and drop to adjust lesson times, add field trips and extracurriculars, or create different schedules for each child. Export your completed schedule to print for the learning space or share digitally with co-op groups and tutors.

Perfect for new homeschool families starting their journey or experienced educators refining their routine. Build a schedule that works for YOUR family, not a one-size-fits-all classroom approach.`,
        category: "Education",
        icon: "Home",
        settings: {
            weekStartsOnSunday: true,
            use12HourFormat: true,
            workingHoursStart: 8,
            workingHoursEnd: 16,
            timeIncrement: 15,
        },
        events: [
            // Monday (day 1 when weekStartsOnSunday)
            createEvent("Morning Circle", "Calendar, weather, read-aloud", 1, 8, 30, 9, 0, "yellow"),
            createEvent("Math", "Lesson + practice problems", 1, 9, 0, 10, 0, "blue"),
            createEvent("Snack Break", "Healthy snack time", 1, 10, 0, 10, 15, "teal"),
            createEvent("Reading", "Phonics / literature", 1, 10, 15, 11, 15, "green"),
            createEvent("Science", "Hands-on experiments", 1, 11, 15, 12, 0, "orange"),
            createEvent("Lunch & Free Play", "Family lunch break", 1, 12, 0, 13, 0, "pink"),
            createEvent("Writing", "Journal / handwriting", 1, 13, 0, 13, 45, "purple"),
            createEvent("Art", "Creative projects", 1, 14, 0, 15, 0, "red"),
            // Tuesday (day 2)
            createEvent("Morning Circle", "Daily routine", 2, 8, 30, 9, 0, "yellow"),
            createEvent("Math", "New concepts + review", 2, 9, 0, 10, 0, "blue"),
            createEvent("Snack Break", "Movement break", 2, 10, 0, 10, 15, "teal"),
            createEvent("Reading", "Silent reading time", 2, 10, 15, 11, 15, "green"),
            createEvent("History", "Story of the World", 2, 11, 15, 12, 0, "orange"),
            createEvent("Lunch & Free Play", "Outdoor time", 2, 12, 0, 13, 0, "pink"),
            createEvent("Music", "Instrument practice", 2, 13, 0, 13, 45, "purple"),
            createEvent("PE / Sports", "Physical activity", 2, 14, 0, 15, 0, "red"),
            // Wednesday (day 3)
            createEvent("Morning Circle", "Poetry memorization", 3, 8, 30, 9, 0, "yellow"),
            createEvent("Math", "Games + worksheets", 3, 9, 0, 10, 0, "blue"),
            createEvent("Snack Break", "Reading corner", 3, 10, 0, 10, 15, "teal"),
            createEvent("Reading", "Book discussion", 3, 10, 15, 11, 15, "green"),
            createEvent("Nature Study", "Outdoor exploration", 3, 11, 15, 12, 30, "orange"),
            createEvent("Lunch & Free Play", "Picnic if weather permits", 3, 12, 30, 13, 30, "pink"),
            createEvent("Library Visit", "Weekly library trip", 3, 14, 0, 15, 30, "purple"),
            // Thursday (day 4)
            createEvent("Morning Circle", "Calendar activities", 4, 8, 30, 9, 0, "yellow"),
            createEvent("Math", "Problem solving", 4, 9, 0, 10, 0, "blue"),
            createEvent("Snack Break", "Stretch break", 4, 10, 0, 10, 15, "teal"),
            createEvent("Reading", "Reading aloud together", 4, 10, 15, 11, 15, "green"),
            createEvent("Geography", "Map skills + culture", 4, 11, 15, 12, 0, "orange"),
            createEvent("Lunch & Free Play", "Indoor games", 4, 12, 0, 13, 0, "pink"),
            createEvent("Writing", "Creative writing", 4, 13, 0, 13, 45, "purple"),
            createEvent("Craft Project", "Hands-on making", 4, 14, 0, 15, 0, "red"),
            // Friday (day 5)
            createEvent("Morning Circle", "Week review", 5, 8, 30, 9, 0, "yellow"),
            createEvent("Math", "Math games / review", 5, 9, 0, 10, 0, "blue"),
            createEvent("Snack Break", "Celebration snack", 5, 10, 0, 10, 15, "teal"),
            createEvent("Reading", "Free choice reading", 5, 10, 15, 11, 0, "green"),
            createEvent("Show & Tell", "Share what we learned", 5, 11, 0, 11, 30, "orange"),
            createEvent("Field Trip / Co-op", "Group activities", 5, 12, 0, 15, 0, "pink"),
        ],
        faq: [
            {
                question: "How do I create a homeschool schedule for multiple children?",
                answer: "Use color coding to assign subjects to different children, or create separate calendar views for each child. You can also schedule overlapping times for subjects you teach together and individual blocks for one-on-one instruction.",
            },
            {
                question: "Can I adjust the schedule for different learning styles?",
                answer: "Absolutely! Drag and drop to move subjects around. Place challenging subjects during your child's peak focus times, and add breaks as needed. The template is just a starting point—customize it to match your family's rhythm.",
            },
            {
                question: "How much time should each subject take in homeschool?",
                answer: "This varies by age and subject. Elementary students typically need 15-30 minutes per subject, while older students may need 45-60 minutes. Our template uses 45-minute blocks by default, but you can easily resize events to fit your needs.",
            },
            {
                question: "What if we don't follow a strict schedule?",
                answer: "Many homeschool families prefer a flexible routine over a rigid schedule. Use this tool as a guide rather than a strict timetable. You can create a general flow for the day while leaving room for spontaneous learning moments.",
            },
            {
                question: "Can I add extracurriculars and co-op activities?",
                answer: "Yes! Add any activities to your schedule including co-op classes, sports, music lessons, field trips, and playdates. This helps you see your full week at a glance and avoid over-scheduling.",
            },
            {
                question: "Is the homeschool schedule builder really free?",
                answer: "Yes! The homeschool schedule builder is completely free to use. Create schedules, customize them for your family, and export as images. Pro users can remove watermarks and export to PDF for a polished printable version.",
            },
        ],
    },

    // ============================================
    // PRD Keyword Template 8: Cleaning Schedule Builder
    // ============================================
    "cleaning-schedule-builder": {
        slug: "cleaning-schedule-builder",
        title: "Cleaning Schedule Builder",
        description: "Create printable cleaning schedules and chore charts. Perfect for busy households, roommates, and anyone who wants a tidy home.",
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
        },
        events: [
            // Sunday (day 0) - Weekly deep clean
            createEvent("Weekly Laundry", "Wash, dry, fold all clothes", 0, 9, 0, 11, 0, "blue"),
            createEvent("Change Bed Sheets", "All bedrooms", 0, 11, 0, 12, 0, "purple"),
            createEvent("Meal Prep & Kitchen Deep Clean", "Clean appliances, organize fridge", 0, 14, 0, 16, 0, "green"),
            // Monday (day 1)
            createEvent("Morning Tidy", "Make beds, quick pickup", 1, 7, 0, 7, 30, "yellow"),
            createEvent("Kitchen Clean", "Dishes, wipe counters, sweep", 1, 19, 0, 19, 30, "green"),
            createEvent("Take Out Trash", "All rooms", 1, 20, 0, 20, 15, "red"),
            // Tuesday (day 2)
            createEvent("Morning Tidy", "Make beds, quick pickup", 2, 7, 0, 7, 30, "yellow"),
            createEvent("Bathroom Clean", "Scrub toilet, sink, mirror", 2, 19, 0, 19, 45, "teal"),
            createEvent("Vacuum Living Room", "Floors and rugs", 2, 20, 0, 20, 30, "orange"),
            // Wednesday (day 3)
            createEvent("Morning Tidy", "Make beds, quick pickup", 3, 7, 0, 7, 30, "yellow"),
            createEvent("Kitchen Clean", "Dishes, wipe counters", 3, 19, 0, 19, 30, "green"),
            createEvent("Dust Surfaces", "Living room & bedrooms", 3, 20, 0, 20, 30, "pink"),
            // Thursday (day 4)
            createEvent("Morning Tidy", "Make beds, quick pickup", 4, 7, 0, 7, 30, "yellow"),
            createEvent("Mop Floors", "Kitchen & bathroom", 4, 19, 0, 19, 45, "blue"),
            createEvent("Wipe Appliances", "Microwave, stovetop", 4, 20, 0, 20, 30, "green"),
            // Friday (day 5)
            createEvent("Morning Tidy", "Make beds, quick pickup", 5, 7, 0, 7, 30, "yellow"),
            createEvent("Quick Bathroom Wipe", "Sink and mirror", 5, 19, 0, 19, 15, "teal"),
            createEvent("Vacuum Bedrooms", "All bedroom floors", 5, 19, 30, 20, 0, "orange"),
            createEvent("Take Out Trash", "Trash day prep", 5, 20, 0, 20, 15, "red"),
            // Saturday (day 6)
            createEvent("Deep Clean Task", "Rotate: windows, baseboards, etc.", 6, 10, 0, 11, 30, "purple"),
            createEvent("Organize & Declutter", "One room focus", 6, 14, 0, 15, 30, "pink"),
            createEvent("Grocery & Restock", "Cleaning supplies check", 6, 16, 0, 17, 0, "blue"),
        ],
        faq: [
            {
                question: "How do I create a cleaning schedule for roommates?",
                answer: "Use color coding to assign different colors to each roommate. Create recurring tasks and rotate assignments weekly. Export the schedule and share it digitally or print it for the common area so everyone stays accountable.",
            },
            {
                question: "What cleaning tasks should I do daily vs weekly?",
                answer: "Daily tasks include making beds, doing dishes, and quick tidying. Weekly tasks include vacuuming, mopping, bathroom deep cleaning, and laundry. Monthly tasks include cleaning appliances, washing windows, and organizing closets. Our template includes a balanced mix of all three.",
            },
            {
                question: "Can I print this cleaning schedule as a checklist?",
                answer: "Yes! Export your schedule as a PNG or JPG image and print it. Many users hang their printable cleaning schedule on the refrigerator or inside a cabinet door for easy reference.",
            },
            {
                question: "How do I stay motivated to follow the cleaning schedule?",
                answer: "Break tasks into small, manageable chunks spread throughout the week. Use the color-coded visual to see your progress. Having a schedule removes decision fatigue—you just follow the plan instead of wondering what needs to be done.",
            },
            {
                question: "Can I customize the schedule for a larger home?",
                answer: "Absolutely! Add more time blocks for additional rooms or split tasks across multiple days. You can also schedule deep cleaning tasks for specific rooms on rotation (e.g., deep clean one room per week).",
            },
            {
                question: "Is this cleaning schedule builder free?",
                answer: "Yes! The cleaning schedule builder is completely free. Create your schedule, customize it for your household, and export as a printable image. Pro users can remove watermarks and export to PDF.",
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
