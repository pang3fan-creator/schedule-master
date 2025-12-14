"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Calendar, Clock, Users, Briefcase, GraduationCap, Heart } from "lucide-react";

const templates = [
    {
        slug: "weekly-work-schedule",
        title: "Weekly Work Schedule",
        description: "Perfect for managing employee shifts and work hours",
        icon: Briefcase,
        category: "Business",
    },
    {
        slug: "class-timetable",
        title: "Class Timetable",
        description: "Organize your academic schedule with ease",
        icon: GraduationCap,
        category: "Education",
    },
    {
        slug: "team-meeting-planner",
        title: "Team Meeting Planner",
        description: "Coordinate team meetings and availability",
        icon: Users,
        category: "Business",
    },
    {
        slug: "personal-routine",
        title: "Personal Routine",
        description: "Build healthy habits with a structured daily routine",
        icon: Heart,
        category: "Personal",
    },
    {
        slug: "shift-rotation",
        title: "Shift Rotation",
        description: "Manage rotating shifts for 24/7 operations",
        icon: Clock,
        category: "Business",
    },
    {
        slug: "event-calendar",
        title: "Event Calendar",
        description: "Plan and track upcoming events and deadlines",
        icon: Calendar,
        category: "Personal",
    },
];

export default function TemplatesPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 py-16 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Schedule Templates
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Get started quickly with our professionally designed templates.
                            <br />
                            Choose one that fits your needs and customize it to perfection.
                        </p>
                    </div>
                </section>

                {/* Templates Grid */}
                <section className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => {
                            const Icon = template.icon;
                            return (
                                <Link
                                    key={template.slug}
                                    href={`/templates/${template.slug}`}
                                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <Icon className="size-6 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                                                {template.category}
                                            </span>
                                            <h3 className="text-lg font-semibold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
                                                {template.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-2">
                                                {template.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
