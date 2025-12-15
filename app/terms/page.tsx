import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "Terms of Service | Schedule Builder",
    description: "Terms of Service for Schedule Builder",
}

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-8">Last updated: December 15, 2025</p>

                    <div className="prose prose-gray max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 mb-4">
                                By accessing and using Schedule Builder ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                            <p className="text-gray-600 mb-4">
                                Schedule Builder is a web-based scheduling and planning tool that allows users to create, manage, and share schedules. We provide various subscription tiers including free and paid options with different feature sets.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                            <p className="text-gray-600 mb-4">
                                To use certain features of the Service, you must register for an account. You agree to:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                <li>Provide accurate and complete information during registration</li>
                                <li>Maintain the security of your password and account</li>
                                <li>Notify us immediately of any unauthorized use of your account</li>
                                <li>Accept responsibility for all activities that occur under your account</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Payment Terms</h2>
                            <p className="text-gray-600 mb-4">
                                For paid subscriptions, you agree to pay all fees associated with your chosen plan. Payments are processed through our third-party payment provider. Subscriptions automatically renew unless cancelled before the renewal date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
                            <p className="text-gray-600 mb-4">You agree not to:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                                <li>Use the Service for any unlawful purpose</li>
                                <li>Attempt to gain unauthorized access to any portion of the Service</li>
                                <li>Interfere with or disrupt the Service or servers</li>
                                <li>Upload malicious code or content</li>
                                <li>Resell or redistribute the Service without authorization</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-600 mb-4">
                                The Service and its original content, features, and functionality are owned by ScheduleApp, Inc. and are protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                            <p className="text-gray-600 mb-4">
                                In no event shall ScheduleApp, Inc. be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Terms</h2>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
                            <p className="text-gray-600">
                                If you have any questions about these Terms, please contact us at{" "}
                                <a href="mailto:legal@schedulebuilder.com" className="text-blue-600 hover:underline">
                                    legal@schedulebuilder.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
