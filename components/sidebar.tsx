"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Download, Settings, RotateCcw, Sparkles } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="flex w-[230px] shrink-0 flex-col border-r border-gray-100 p-4">
      {/* Add New Item Button */}
      <Button className="mb-4 w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
        <PlusCircle className="size-5" />
        Add New Item
      </Button>

      {/* Day/Week Toggle */}
      <Tabs defaultValue="week" className="mb-6">
        <TabsList className="w-full grid grid-cols-2 bg-gray-100">
          <TabsTrigger value="day" className="data-[state=active]:bg-white">
            Day
          </TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-white">
            Week
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Menu Items */}
      <nav className="flex flex-col gap-1">
        <Button variant="ghost" className="justify-start gap-3 text-gray-600 hover:text-gray-900">
          <Download className="size-5" />
          Export/Download
        </Button>
        <Button variant="ghost" className="justify-start gap-3 text-gray-600 hover:text-gray-900">
          <Settings className="size-5" />
          Settings
        </Button>
        <Button variant="ghost" className="justify-start gap-3 text-gray-600 hover:text-gray-900">
          <RotateCcw className="size-5" />
          Reset
        </Button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* AI Autofill Button */}
      <Button className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white gap-2">
        <Sparkles className="size-5" />
        AI Autofill
      </Button>
    </aside>
  )
}
