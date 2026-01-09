"use client"

import { useState } from "react"
import { PageLayout } from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import { Breadcrumb } from "@/components/Breadcrumb"

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formState),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "发送失败，请稍后重试")
            }

            // 成功提交
            setIsSubmitted(true)
            // 重置表单
            setFormState({
                name: "",
                email: "",
                subject: "",
                message: "",
            })
        } catch (error) {
            console.error("表单提交错误:", error)
            alert(error instanceof Error ? error.message : "发送失败，请稍后重试")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <PageLayout>
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Contact" }
                    ]} />
                </div>

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Contact Info Cards - Horizontal Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gray-50 rounded-xl p-6 border border-slate-200 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                            <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-500 text-sm mb-2">For general inquiries</p>
                        <a href="mailto:support@tryschedule.com" className="text-blue-600 hover:underline text-sm">
                            support@tryschedule.com
                        </a>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-slate-200 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                            <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Office</h3>
                        <p className="text-gray-500 text-sm">
                            123 Tech Street<br />
                            San Francisco, CA 94102<br />
                            United States
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-slate-200 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                        <p className="text-gray-500 text-sm">
                            Monday - Friday<br />
                            9:00 AM - 6:00 PM (PST)<br />
                            Weekend: Closed
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-gray-50 rounded-xl p-8 border border-slate-200 shadow-sm">
                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Message Sent!</h2>
                            <p className="text-gray-600 mb-6">
                                Thank you for reaching out. We'll get back to you within 24-48 hours.
                            </p>
                            <Button onClick={() => setIsSubmitted(false)} variant="outline">
                                Send Another Message
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Your name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formState.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="How can we help?"
                                    value={formState.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell us more about your inquiry..."
                                    value={formState.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </PageLayout>
    )
}
