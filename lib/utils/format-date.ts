export function formatDateToDDMMYY(isoDateString: string) {
  if (!isoDateString) return "";

  const date = new Date(isoDateString);

  const day = date.getDate().toString().padStart(2, "0"); // Get day and pad with zero if needed
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month and pad with zero if needed
  const year = date.getFullYear().toString().slice(-2); // Get year and take the last two digits

  return `${day}/${month}/${year}`;
}

export const convertDate = (isoDate: string) => {
  if (!isoDate) return isoDate || "";

  let timestamp = Date.parse(isoDate);
  let jsDate = new Date(timestamp);
  let fDate = new Intl.DateTimeFormat("en-uk", {
    dateStyle: "short",
    timeStyle: "short",
  });
  return fDate.format(jsDate);
};

export function formatTimeDDMMYY(inputDateString: string) {
  const date: Date = new Date(inputDateString);
  const day: string = ("0" + date.getDate()).slice(-2);
  const month: string = ("0" + (date.getMonth() + 1)).slice(-2);
  const year: string = date.getFullYear().toString().slice(-2);

  return `${day}/${month}/${year}`;
}
