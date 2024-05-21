import React, { useRef } from "react";

const CalendarIcon: React.FC = () => {
  const datePickerRef = useRef<HTMLInputElement | null>(null);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    console.log("Selected Date:", selectedDate);
    // You can perform any further actions with the selected date here
  };

  const handleCalendarIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.click();
    }
  };

  return (
    <div className="relative inline-block">
      <label htmlFor="datePicker" className="sr-only">
        Select a date
      </label>
      <input
        type="date"
        id="datePicker"
        className="hidden"
        onChange={handleDateChange}
        ref={datePickerRef}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        className="cursor-pointer"
        onClick={handleCalendarIconClick}
      >
        <path
          d="M20 3H19V1H17V3H7V1H5V3H4C2.9 3 2 3.9 2 5V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V5C22 3.9 21.1 3 20 3ZM20 21H4V10H20V21ZM20 8H4V5H20V8Z"
          fill="#555555"
        />
      </svg>
    </div>
  );
};

export default CalendarIcon;
