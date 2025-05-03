
import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker, DropdownProps } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}

interface DateRangePickerProps {
  value: [Date | undefined, Date | undefined];
  onChange: (value: { from: Date | undefined; to: Date | undefined }) => void;
  calendarTodayClassName?: string;
}

export function DateRangePicker({ value, onChange, calendarTodayClassName }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: "outline" }),
            "justify-start text-left font-normal w-full"
          )}
        >
          <div className="flex items-center justify-between w-full">
            <span className="truncate">
              {value[0] ? (
                value[1] ? (
                  <>
                    {format(value[0], "LLL d, y")} - {format(value[1], "LLL d, y")}
                  </>
                ) : (
                  format(value[0], "LLL d, y")
                )
              ) : (
                <span>Select a date range</span>
              )}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value[0]}
          selected={{
            from: value[0],
            to: value[1],
          }}
          onSelect={(range) => {
            if (range) {
              onChange(range);
              if (range.from && range.to) {
                setIsOpen(false);
              }
            } else {
              onChange({ from: undefined, to: undefined });
            }
          }}
          numberOfMonths={1}
          classNames={{
            day_today: calendarTodayClassName || "bg-accent text-accent-foreground",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default Calendar;
