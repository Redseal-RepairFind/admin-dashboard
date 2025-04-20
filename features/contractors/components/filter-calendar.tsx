"use client";

import { useCallback, useState } from "react";
import { Popover } from "@headlessui/react";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useFilterContext, Range } from "@/context/filter-context";
import SubmitBtn from "@/components/ui/submit-btn";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatISO } from "date-fns"; // or use dayjs if preferred
import toast from "react-hot-toast";

const daysRange = [
  "Last 24h",
  "Last 7 days",
  "Last Month",
  "Last 2 Month",
  "Last 3 Month",
  "Last 6 Month",
  "Last 1 Year",
] as Range[];
export default function FilterCalendar({
  btnTitle = "Filter for Selected Date",
}: {
  btnTitle?: string;
}) {
  const { selectedDate, setSelectedDate, range, setRangeBasedOnEndDate } =
    useFilterContext();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const param = useSearchParams();

  const startDate = param.get("startDate") || "";
  const endDate = param.get("endDate") || "";

  // Fetch the initial 'sort' parameter from the URL (query)

  // const getRangeLabel = (start: Date | null) => {
  //   if (!start || !selectedDate.endDate) return range;

  //   const diff = dayjs(selectedDate.endDate).diff(dayjs(start), "day");

  //   if (diff <= 1) handleRangeSelect("Last 24h");
  //   if (diff <= 7) handleRangeSelect("Last 7 days");
  //   if (diff <= 30) handleRangeSelect("Last Month");
  //   if (diff <= 60) handleRangeSelect("Last 2 Month");
  //   if (diff <= 90) handleRangeSelect("Last 3 Month");
  //   if (diff <= 180) handleRangeSelect("Last 6 Month");
  //   handleRangeSelect("Last 1 Year");
  // };

  const handleFilter = () => {
    const params = new URLSearchParams(window.location.search);

    if (!selectedDate.startDate || !selectedDate.endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (selectedDate.startDate) {
      params.set(
        "startDate",
        formatISO(selectedDate.startDate, { representation: "date" })
      );
    } else {
      params.delete("startDate");
    }

    if (selectedDate.endDate) {
      params.set(
        "endDate",
        formatISO(selectedDate.endDate, { representation: "date" })
      );
    } else {
      params.delete("endDate");
    }

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });

    setIsPopoverOpen(false);
  };

  const handleClearFilter = () => {
    router.replace(`${pathname}`, {
      scroll: false,
    });
    setIsPopoverOpen(false);
  };

  const handleRangeSelect = (selectedRange: Range) => {
    setRangeBasedOnEndDate(selectedRange, selectedDate.endDate);
  };

  const handleStartDateChange = (date: Date | null) => {
    setSelectedDate((prev: any) => ({ ...prev, startDate: date }));
    // setRangeBasedOnEndDate(range, date);
    // getRangeLabel(date);
  };
  const handleEndDateChange = (date: Date | null) => {
    setSelectedDate((prev: any) => ({ ...prev, endDate: date }));
    setRangeBasedOnEndDate(range, date);
  };

  return (
    <div className="relative w-max">
      <Popover className="relative">
        <Popover.Button
          className="flex items-center gap-2 border px-4 py-2 rounded-xl text-sm bg-white hover:bg-gray-100"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <CalendarIcon className="w-4 h-4" />
          {btnTitle}
        </Popover.Button>
        {isPopoverOpen ? (
          <Popover.Panel
            className="absolute z-50 mt-2 w-max bg-white p-4 rounded-lg shadow-xl border"
            static
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-700">
                  Select Range
                </span>
                {startDate && endDate ? (
                  <button
                    className="bg-gray-200 py-1 px-3 rounded-md shadow-xl text-xs"
                    onClick={handleClearFilter}
                  >
                    Clear filter
                  </button>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {daysRange.map((r) => (
                    <button
                      key={r}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        range === r
                          ? "bg-blue-100 text-blue-600 border-blue-300"
                          : "text-gray-600"
                      }`}
                      onClick={() => handleRangeSelect(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col gap-2 z-50">
                  <span className="font-medium text-sm text-gray-700">
                    Select Start Date:
                  </span>
                  <DatePicker
                    selected={selectedDate.startDate}
                    onChange={handleStartDateChange}
                    className="border p-2 rounded-md text-sm w-52 z-50"
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="flex flex-col gap-2 z-50">
                  <span className="font-medium text-sm text-gray-700">
                    Select End Date:
                  </span>
                  <DatePicker
                    selected={selectedDate.endDate}
                    onChange={handleEndDateChange}
                    className="border p-2 rounded-md text-sm w-52 z-50"
                    maxDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>

              <SubmitBtn isSubmitting={false} onClick={handleFilter}>
                Filter
              </SubmitBtn>
            </div>
          </Popover.Panel>
        ) : null}
      </Popover>
    </div>
  );
}
