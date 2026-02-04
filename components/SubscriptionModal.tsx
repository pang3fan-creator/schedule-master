"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/components/SubscriptionContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, ExternalLink, Loader2 } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const planDisplayNames: Record<string, string> = {
  free: "Free",
  "7day": "7-Day Pass",
  monthly: "Pro Monthly",
  lifetime: "Lifetime",
};

export function SubscriptionModal({
  open,
  onOpenChange,
}: SubscriptionModalProps) {
  const router = useRouter();
  const { plan, isPro, isLoading, customerId, expiresAt, status } =
    useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);

  const planName = planDisplayNames[plan] || plan;
  const isActive = status === "active";
  const showExpiration = (plan === "7day" || plan === "monthly") && expiresAt;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push("/pricing");
  };

  const handleManageSubscription = async () => {
    if (!customerId) return;

    setPortalLoading(true);
    try {
      const res = await fetch("/api/subscription/portal");
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.open(data.url, "_blank");
        }
      }
    } catch (error) {
      console.error("Failed to get portal URL:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            My Subscription
          </DialogTitle>
          <DialogDescription className="sr-only">
            View and manage your current subscription plan details.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Plan Info */}
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current Plan
                  </p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {planName}
                  </p>
                </div>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={
                    isActive
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                      : ""
                  }
                >
                  {isActive ? "Active" : "Expired"}
                </Badge>
              </div>

              {/* Expiration Date */}
              {showExpiration && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {isActive ? "Expires on " : "Expired on "}
                    {formatDate(expiresAt!)}
                  </span>
                </div>
              )}

              {/* Lifetime badge */}
              {plan === "lifetime" && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  🎉 You have lifetime access. No expiration!
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {isPro && customerId ? (
                <Button
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="w-full"
                  variant="outline"
                >
                  {portalLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="mr-2 h-4 w-4" />
                  )}
                  Manage Subscription
                </Button>
              ) : (
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
