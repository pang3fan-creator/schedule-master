"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function ContactPageClient() {
  const t = useTranslations("Contact");

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errors.sendFailed"));
      }

      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      alert(error instanceof Error ? error.message : t("errors.sendFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: t("breadcrumb.home"), href: "/" },
              { label: t("breadcrumb.contact") },
            ]}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("header.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("header.subtitle")}
          </p>
        </div>

        {/* Contact Info Cards - Horizontal Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-6 border border-slate-200 dark:border-gray-700 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t("infoCards.email.title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              {t("infoCards.email.description")}
            </p>
            <a
              href="mailto:support@tryschedule.com"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              support@tryschedule.com
            </a>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-6 border border-slate-200 dark:border-gray-700 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-4">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t("infoCards.office.title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("infoCards.office.address1")}
              <br />
              {t("infoCards.office.address2")}
              <br />
              {t("infoCards.office.address3")}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-6 border border-slate-200 dark:border-gray-700 text-center">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t("infoCards.hours.title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("infoCards.hours.line1")}
              <br />
              {t("infoCards.hours.line2")}
              <br />
              {t("infoCards.hours.line3")}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl p-8 border border-slate-200 dark:border-gray-700 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {t("success.title")}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t("success.message")}
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                {t("success.sendAnother")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-900 dark:text-white"
                  >
                    {t("form.name.label")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t("form.name.placeholder")}
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-900 dark:text-white"
                  >
                    {t("form.email.label")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("form.email.placeholder")}
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-gray-900 dark:text-white"
                >
                  {t("form.subject.label")}
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder={t("form.subject.placeholder")}
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-gray-900 dark:text-white"
                >
                  {t("form.message.label")}
                </Label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t("form.message.placeholder")}
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="flex w-full rounded-md border border-input bg-background dark:bg-gray-800 dark:border-gray-600 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none dark:text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  t("form.submitting")
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t("form.submit")}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
