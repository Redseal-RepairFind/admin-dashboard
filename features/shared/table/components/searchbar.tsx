"use client";
import { HeaderSearch } from "@/public/svg";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  placeholder?: string;
  handleQuery?: (value: string) => void;
  notFound?: boolean;
}

const Searchbar: React.FC<IProps> = ({
  placeholder = "search",
  handleQuery,
  notFound,
}) => {
  const [queryValue, setQueryValue] = useState<string>("");

  const handleChange = (value: string) => {
    setQueryValue(value);
    if (handleQuery) {
      handleQuery(value);
    }
  };

  const handleNotFound = () => {
    if (notFound) {
      toast.error("Not Found", {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };

  return (
    <div className="border border-[#ddd] flex px-3 py-2 items-center min-w-[265px] rounded justify-between">
      <input
        className="text-sm outline-none w-full pr-4"
        type="search"
        placeholder={placeholder}
        value={queryValue}
        onChange={(e) => handleChange(e.target.value)}
      />

      <div onClick={() => handleNotFound()}>
        <HeaderSearch />
      </div>
    </div>
  );
};

export default Searchbar;
