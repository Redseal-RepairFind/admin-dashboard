"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import dayjs from "dayjs";

export type Range =
  | "Last 24h"
  | "Last 7 days"
  | "Last Month"
  | "Last 2 Month"
  | "Last 3 Month"
  | "Last 6 Month"
  | "Last 1 Year";

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type FilterContextType = {
  selectedDate: DateRange;
  setSelectedDate: (val: any) => void;
  range: Range;
  setRange: (val: Range) => void;
  setRangeBasedOnEndDate: (range: Range, endDate: Date | null) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<DateRange>({
    startDate: null,
    endDate: new Date(),
  });

  const [range, setRange] = useState<Range>("Last 6 Month");

  const setRangeBasedOnEndDate = (
    selectedRange: Range,
    endDate: Date | null
  ) => {
    let days = 1;
    switch (selectedRange) {
      case "Last 24h":
        days = 1;
        break;
      case "Last 7 days":
        days = 7;
        break;
      case "Last Month":
        days = 30;
        break;
      case "Last 2 Month":
        days = 60;
        break;
      case "Last 3 Month":
        days = 90;
        break;
      case "Last 6 Month":
        days = 183;
        break;
      case "Last 1 Year":
        days = 365;
        break;
    }

    const start = endDate
      ? dayjs(endDate).subtract(days, "day").toDate()
      : null;
    setRange(selectedRange);
    setSelectedDate({
      endDate,
      startDate: start,
    });
  };

  return (
    <FilterContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        range,
        setRange,
        setRangeBasedOnEndDate,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
