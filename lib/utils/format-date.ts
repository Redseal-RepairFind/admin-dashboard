export function formatDateToDDMMYY(
  dateString: string,
  itsDate?: boolean
): string | number {
  // Create a new Date object from the ISO date string
  const date = new Date(dateString);

  // Use Intl.DateTimeFormat to format the date and time
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", options)?.format(date);

  return itsDate ? date.getDate() : formattedDate;
}
export function formatTimeDDMMYY(
  dateString: string,
  itsDate?: boolean
): string | number {
  if (!dateString) {
    return "No Date Available"; // Return a fallback if the dateString is invalid
  }

  const date = new Date(dateString);

  if (isNaN(date?.getTime())) {
    return "Invalid Date"; // Handle invalid date values
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true, // Display 24-hour format
  };

  const onlyDateOptions: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    // hour12: false, // Display 24-hour format
  };

  const formattedDate = new Intl.DateTimeFormat(
    "en-GB",
    itsDate ? options : onlyDateOptions
  )?.format(date);

  return formattedDate;
}

export function formatDate(date: any) {
  const year = date?.getFullYear();
  const month = String(date?.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date?.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
