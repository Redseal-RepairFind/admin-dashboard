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

export function formatDate(
  date: Date | string | number | null | undefined
): string {
  if (!date) {
    return "No Date Available"; // Fallback if the date is null, undefined, or invalid
  }

  try {
    // Convert date to a Date instance if it's not already
    const parsedDate =
      typeof date === "string" || typeof date === "number"
        ? new Date(date)
        : date;

    // Check if the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date";
    }

    const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    return new Intl.DateTimeFormat(userLocale, options).format(parsedDate);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date Formatting Error";
  }
}
