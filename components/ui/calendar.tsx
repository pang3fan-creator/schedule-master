"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  showWeekNumber = true,
  ...props
}: CalendarProps) {
  const locale = useLocale();
  const t = useTranslations("Common");

  // Map locale string to date-fns locale object
  const dateFnsLocale = locale === "es" ? es : enUS;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      showWeekNumber={showWeekNumber}
      locale={dateFnsLocale}
      className={cn("p-3", className)}
      formatters={{
        formatWeekdayName: (date) =>
          format(date, "EEE", { locale: dateFnsLocale }),
        formatWeekNumber: (weekNumber) => `${weekNumber}`,
      }}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-base font-semibold",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "absolute left-5 top-3 z-10 size-7 inline-flex items-center justify-center rounded-md border bg-background p-0 opacity-50 hover:opacity-100 hover:bg-accent transition-opacity cursor-pointer",
        ),
        button_next: cn(
          "absolute right-4 top-3 z-10 size-7 inline-flex items-center justify-center rounded-md border bg-background p-0 opacity-50 hover:opacity-100 hover:bg-accent transition-opacity cursor-pointer",
        ),
        month_grid: "w-full border-collapse mt-3",
        weekdays: "flex items-start",
        weekday: "text-foreground w-10 font-medium text-[0.8rem] text-center",
        week: "flex w-full",
        week_number:
          "text-muted-foreground text-[0.8rem] w-8 flex items-center justify-center font-normal border-r border-border mr-2 py-2",
        week_number_header:
          "text-foreground text-[0.8rem] w-8 font-medium text-center border-r border-border mr-2 pb-4",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-outside)]:bg-accent/50",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "[&:has([aria-selected])]:rounded-full",
        ),
        day_button: cn(
          "inline-flex items-center justify-center rounded-full text-sm font-normal hover:bg-transparent hover:text-blue-600 size-10 p-0 aria-selected:opacity-100 cursor-pointer transition-colors",
        ),
        range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        selected:
          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 rounded-full",
        today: "bg-accent text-accent-foreground rounded-full",
        outside: "day-outside text-muted-foreground aria-selected:text-white",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className="size-4" />;
        },
        WeekNumberHeader: () => (
          <th className="inline-flex items-center justify-center w-8 mr-2 border-r border-border text-[0.8rem] font-medium pb-4">
            {t("calendarPicker.weekLabel")}
          </th>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
