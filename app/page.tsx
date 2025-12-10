import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { WeeklyCalendar } from "@/components/weekly-calendar"

export default function ScheduleBuilderPage() {
  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <WeeklyCalendar />
        </main>
      </div>
    </div>
  )
}
