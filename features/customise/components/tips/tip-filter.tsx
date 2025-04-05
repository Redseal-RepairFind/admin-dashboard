import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { List } from "./list";
import { FilterProp } from ".";
import { useEffect, useState } from "react";

function Filter({ filterProps }: FilterProp) {
  const pathname = usePathname();
  const router = useRouter();
  const param = useSearchParams();

  // Fetch the initial 'sort' parameter from the URL (query)
  const initialString = param.get("filter");
  const initialSortValue = initialString
    ? initialString.replace(/_/g, " ")
    : "All";

  // Set the selected sort value state, initialize with the value from URL
  const [sortValue, setSortValue] = useState(initialSortValue);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [sortValue]);

  // On page load, ensure the sort value in the state is in sync with URL
  useEffect(() => {
    const sortFromParam = param.get("filter");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue); // Update state based on URL query params
    }
  }, [param]);

  // Function to update the URL params and the state
  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase(); // Replace spaces with underscores

    // Update the URL query parameters
    if (value === "All") {
      router.replace(`${pathname}`, {
        scroll: false,
      }); // Remove query params if 'All' is selected (default)
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("filter", formattedValue); // Set the selected filter in query params
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    // Set the selected value in the state
    setSortValue(value);
  }

  return (
    <button
      className="text-xs font-medium border border-gray-400 rounded-sm py-4 px-2 focus:ring-0 outline-none relative w-28 bg-white transition-all duration-500 flex justify-between items-center"
      onClick={() => setIsOpen((is) => !is)}
    >
      <span className="capitalize">{sortValue}</span>
      {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
      {isOpen ? (
        <List
          onClick={updateUrlParams}
          state={sortValue}
          closeModal={() => setIsOpen(false)}
          filterProps={filterProps} // Pass the filter options to the list component
        />
      ) : null}
    </button>
  );
}
