"use client";

import { createContext, useEffect, useState, useContext } from "react";

type Checked = {
  // isChecked: boolean;
  items: any;
};
type CheckedData = {
  checkedList: any;
  setCheckedList: React.Dispatch<React.SetStateAction<Checked>>;
  handleCheck: (data: any) => void;
  handleSelectAll: (data: any) => void;
};

const CheckedContext = createContext<CheckedData>({
  checkedList: { items: {} },
  setCheckedList: () => {},
  handleCheck: () => {},
  handleSelectAll: () => {},
});

function CheckedProvider({ children }: { children: React.ReactNode }) {
  const [checkedList, setCheckedList] = useState<any>([]);

  useEffect(() => {
    setCheckedList([]);
  }, []);

  function handleCheck(data: any) {
    // Check if the item already exists in the checkedList
    if (checkedList?.some((item: any) => item?._id === data._id)) {
      // Remove the item if it exists
      const updatedCheckedList = checkedList.filter(
        (item: any) => item?._id !== data?._id
      );
      setCheckedList(updatedCheckedList);
    } else {
      // Add the item if it doesn't exist

      setCheckedList((prevData: any) => [...prevData, data]);
    }
  }

  function handleSelectAll(filteredData: any) {
    if (checkedList?.length === filteredData?.data?.data?.length) {
      // Deselect all if everything is already selected
      setCheckedList([]);
    } else {
      // Select all items
      const allData = filteredData?.data?.data?.map((item: any) => item);
      setCheckedList(allData);
    }
  }

  const value = { checkedList, setCheckedList, handleCheck, handleSelectAll };
  return (
    <CheckedContext.Provider value={value}>{children}</CheckedContext.Provider>
  );
}

function useCheckedList() {
  const context = useContext(CheckedContext);
  if (!context) {
    throw new Error("useCheckedList must be used within a CheckedProvider");
  }
  return context;
}
export { useCheckedList, CheckedProvider };
