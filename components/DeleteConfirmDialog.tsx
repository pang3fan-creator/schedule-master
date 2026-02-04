"use client";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  eventTitle,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Event"
      description={`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`}
      icon={Trash2}
      iconClassName="size-5 text-red-500"
      confirmText="Delete"
      onConfirm={onConfirm}
      variant="destructive"
    />
  );
}
