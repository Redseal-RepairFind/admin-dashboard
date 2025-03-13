"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type props = {
  sortProps: {
    url: string;
    render: string;
  };
};
type FilterProp = {
  sortProps: props[];
  initialState: string;
};

function SortLists({ sortProps, initialState }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const param = useSearchParams();

  // Fetch the initial 'sort' parameter from the URL (query)
  const initialString = param.get("sortList");
  const initialSortValue =
    sortProps?.find(
      (prop: any) => prop?.url?.toLowerCase() === initialString?.toLowerCase()
    )?.render || initialState;

  // Set the selected sort value state, initialize with the value from URL
  const [sortValue, setSortValue] = useState<string>(initialSortValue);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [sortValue]);

  // On page load, ensure the sort value in the state is in sync with URL
  useEffect(() => {
    const sortFromParam = param.get("sortList");
    const updatedSortValue = sortProps?.find(
      (prop: any) => prop?.url?.toLowerCase() === sortFromParam?.toLowerCase()
    );
    if (updatedSortValue) {
      setSortValue(updatedSortValue.render); // Update state based on URL query params
    }
  }, [param, sortProps]);

  // Function to update the URL params and the state
  function updateUrlParams(renderValue: string) {
    const selectedSort = sortProps.find(
      (prop: any) => prop.render === renderValue
    );
    if (selectedSort) {
      const params = new URLSearchParams(param.toString());
      params.set("sortList", selectedSort.url); // Set the selected filter in query params
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
      setSortValue(renderValue); // Set the selected value in the state
      // Close the modal after all changes are set
      setIsOpen(false);
    }
  }

  return (
    <button
      className="text-xs font-medium border border-gray-400 rounded-sm py-4 px-2 focus:ring-0 outline-none relative min-w-28 bg-white transition-all duration-500 flex justify-between items-center z-50"
      onClick={() => setIsOpen((is) => !is)}
    >
      <span className="capitalize">{sortValue}</span>
      {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
      {isOpen ? (
        <List
          onClick={updateUrlParams}
          state={sortValue}
          closeModal={() => setIsOpen(false)}
          sortProps={sortProps}
        />
      ) : null}
    </button>
  );
}

type ListProps = {
  state: string;
  onClick: (value: string) => void;
  closeModal: () => void;
  sortProps: any;
};

function List({ state, onClick, closeModal, sortProps }: ListProps) {
  function handleSelect(text: string) {
    onClick(text);
    closeModal(); // Close the modal when a filter is selected
  }
  return (
    <ul className="absolute text-xs font-medium border border-gray-400 rounded-sm focus:ring-0 outline-none min-w-28 left-0 top-14 bg-white shadow-2xl transition-all duration-500 z-50">
      {sortProps.map((sortProp: any) => (
        <li
          className={`${
            state === sortProp.render
              ? "bg-black text-white"
              : "bg-white text-black"
          } w-full mb-2 p-2 hover:bg-black hover:text-white cursor-pointer transition-all duration-300 text-start`}
          key={sortProp.render}
          onClick={() => handleSelect(sortProp.render)}
        >
          {sortProp.render}
        </li>
      ))}
    </ul>
  );
}

export default SortLists;
