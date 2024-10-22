type SortOrder = "A-Z" | "Z-A" | "Join Date (Newest)" | "Join Date (Oldest)";

interface Contractor {
  name: string; // Assuming each contractor has a name property
  joinDate: string; // Assuming the join date is a string (ISO format is best)
}

/**
 * Sorts an array of contractors based on the specified order.
 * @param data - Array of contractors to be sorted.
 * @param order - The sorting order.
 * @returns - Sorted array of contractors.
 */
export function sortContractors(data: any[], order: string): any[] {
  return data?.sort((a, b) => {
    switch (order) {
      case "a-z":
        return a?.name.localeCompare(b?.name); // Sort by name A-Z
      case "z-a":
        return b?.name.localeCompare(a?.name); // Sort by name Z-A
      case "join date (newest)":
        return (
          new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
        ); // Sort by join date newest
      case "join date (oldest)":
        return (
          new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime()
        ); // Sort by join date oldest
      default:
        return 0; // No sorting if the order is unknown
    }
  });
}
