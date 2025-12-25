import { PageLayout } from "@/components/PageLayout"

export const metadata = {
    title: "Privacy Policy | TrySchedule",
    description: "Privacy Policy for TrySchedule - Free Online Schedule Builder.",
}

export default function PrivacyPage() {
    return (
        <PageLayout bgColor="bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8">Last updated: December 24, 2025</p>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                        <p className="text-gray-600 mb-4">
                            TrySchedule ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our TrySchedule service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
                        <p className="text-gray-600 mb-4">When you register for an account, we may collect:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                            <li>Name and email address</li>
                            <li>Profile information you choose to provide</li>
                            <li>Payment information (processed securely by our payment provider)</li>
                        </ul>

                        <h3 className="text-lg font-medium text-gray-800 mb-3">Usage Information</h3>
                        <p className="text-gray-600 mb-4">We automatically collect:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                            <li>Device and browser information</li>
                            <li>IP address and location data</li>
                            <li>Usage patterns and feature interactions</li>
                            <li>Cookies and similar tracking technologies</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-600 mb-4">We use your information to:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                            <li>Provide and maintain our Service</li>
                            <li>Process your transactions and manage your subscription</li>
                            <li>Send you updates, security alerts, and support messages</li>
                            <li>Improve and personalize your experience</li>
                            <li>Analyze usage patterns to enhance our Service</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
                        <p className="text-gray-600 mb-4">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                            <li>Service providers who assist in operating our Service</li>
                            <li>Business partners with your consent</li>
                            <li>Legal authorities when required by law</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Analytics and Third-Party Tools</h2>
                        <p className="text-gray-600 mb-4">
                            We use third-party analytics services to help us understand how users interact with our Service and to improve user experience. These services may collect anonymous data about your usage of the Service.
                        </p>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Google Analytics</h3>
                        <p className="text-gray-600 mb-4">
                            We use Google Analytics, a web analytics service provided by Google, Inc. Google Analytics uses cookies to analyze how users use our Service. The information generated is transmitted to and stored by Google. For more information on how Google uses data, please visit{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors font-medium"
                            >
                                Google's Privacy Policy
                            </a>.
                        </p>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Microsoft Clarity</h3>
                        <p className="text-gray-600 mb-4">
                            We use Microsoft Clarity, a user behavior analytics tool provided by Microsoft. Clarity captures how users interact with our Service through session recordings and heatmaps. Clarity automatically masks sensitive content to protect user privacy. For more information, please visit{" "}
                            <a
                                href="https://privacy.microsoft.com/en-us/privacystatement"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition-colors font-medium"
                            >
                                Microsoft's Privacy Statement
                            </a>.
                        </p>
                        <h3 className="text-lg font-medium text-gray-800 mb-3">Opting Out</h3>
                        <p className="text-gray-600 mb-4">
                            You can opt out of analytics tracking by adjusting your browser settings to block cookies or by using browser extensions designed to block tracking scripts.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
                        <p className="text-gray-600 mb-4">
                            We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
                        <p className="text-gray-600 mb-4">Depending on your location, you may have the right to:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to or restrict processing</li>
                            <li>Data portability</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies</h2>
                        <p className="text-gray-600 mb-4">
                            We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                        <p className="text-gray-600 mb-4">
                            Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
                        <p className="text-gray-600 mb-4">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                        <p className="text-gray-600">
                            If you have questions about this Privacy Policy, please contact us at{" "}
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
