"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type FilterProp = {
  children?: React.ReactNode;
};

const filterProps = ["All", "Last 24h", "Last 7 days", "Last 30 days"];

function Filter({ children }: FilterProp) {
  const pathname = usePathname();
  const router = useRouter();
  const param = useSearchParams();

  // Fetch the initial 'sort' parameter from the URL (query)
  const initialString = param.get("sort");
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
    const sortFromParam = param.get("sort");
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
      params.set("sort", formattedValue); // Set the selected filter in query params
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
        />
      ) : null}
    </button>
  );
}

type ListProps = {
  state: string;
  onClick: (value: string) => void;
  closeModal: () => void;
};

function List({ state, onClick, closeModal }: ListProps) {
  function handleSelect(text: string) {
    onClick(text);
    closeModal(); // Close the modal when a filter is selected
  }
  return (
    <ul className="absolute text-xs font-medium border border-gray-400 rounded-sm  focus:ring-0  outline-none w-28 left-0 top-14 bg-white shadow-2xl transition-all duration-500 ">
      {filterProps.map((filterProp) => (
        <li
          className={`${
            state.toLowerCase().includes(filterProp.toLowerCase())
              ? "bg-black text-white"
              : "bg-white text-black"
          } w-full mb-2 p-2 hover:bg-black hover:text-white cursor-pointer transition-all duration-300 text-start`}
          key={filterProp}
          onClick={() => handleSelect(filterProp)}
        >
          {filterProp}
        </li>
      ))}
    </ul>
  );
}

export default Filter;
