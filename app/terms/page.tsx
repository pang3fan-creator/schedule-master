import { PageLayout } from "@/components/PageLayout"
import { Breadcrumb } from "@/components/Breadcrumb"

export const metadata = {
    title: "Terms of Service | TrySchedule",
    description: "Terms of Service for TrySchedule - Free Online Schedule Builder.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'}/terms`,
    },
}

export default function TermsPage() {
    return (
        <PageLayout>
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Terms" }
                    ]} />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Terms of Service</h1>
                <p className="text-sm text-gray-500 mb-12 text-center">Last updated: January 1, 2026</p>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 mb-4">
                            By accessing and using TrySchedule ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                        <p className="text-gray-600 mb-4">
                            TrySchedule is a web-based scheduling and planning tool that allows users to create, manage, and share schedules. We provide various subscription tiers including free and paid options with different feature sets.
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
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
                        <p className="text-gray-600 mb-4">
                            Our Service allows you to connect with third-party services, such as Google Calendar, to enhance your scheduling experience. By using these integrations, you agree to comply with the terms and privacy policies of those third-party services.
                        </p>
                        <p className="text-gray-600 mb-4">
                            We are not responsible for the content, privacy policies, or practices of any third-party services. We encourage you to review the terms and privacy policies of any third-party service before connecting it to TrySchedule.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
                        <p className="text-gray-600 mb-4">
                            The Service and its original content, features, and functionality are owned by TrySchedule and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                        <p className="text-gray-600 mb-4">
                            In no event shall TrySchedule be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
                        <p className="text-gray-600 mb-4">
                            We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                        <p className="text-gray-600">
                            If you have any questions about these Terms, please contact us at{" "}
                            <a
                                href="mailto:support@tryschedule.com"
                                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors font-medium"
                            >
                                support@tryschedule.com
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </PageLayout>
    )
}
