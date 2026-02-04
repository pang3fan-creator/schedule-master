"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon?: LucideIcon;
  iconClassName?: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "blue";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconClassName = "size-5 text-gray-500",
  confirmText,
  cancelText,
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  const t = useTranslations("Common");
  const displayCancelText = cancelText || t("buttons.cancel");
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  // Map common variants to specific styles if needed
  const buttonClassName =
    variant === "blue" ? "bg-blue-600 hover:bg-blue-700 text-white" : "";
  const finalVariant = variant === "blue" ? "default" : variant;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] p-0 gap-0 overflow-hidden bg-white dark:bg-gray-900"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              {Icon && <Icon className={iconClassName} />}
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 sm:size-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4 sm:size-5" />
            </Button>
          </div>
          <DialogDescription className="text-left text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pb-0">
          {/* Empty body content or potentially slot for children if extended later */}
        </div>
        <DialogFooter className="gap-2 sm:gap-2 text-right p-6 pt-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {displayCancelText}
          </Button>
          <Button
            variant={finalVariant}
            onClick={handleConfirm}
            className={buttonClassName}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
