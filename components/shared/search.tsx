"use client";

import React, { useEffect, useState } from "react";
import { HeaderSearch } from "@/public/svg";
import { FaSearch } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const Search = ({
  placeholder,
  search,
  setSearch,
  setIsQuerying,
  handleEmpty,
}: {
  placeholder?: any;
  search: any;
  setSearch: any;
  setIsQuerying: any;
  handleEmpty?: any;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm === "") {
      handleEmpty?.("");
      setIsQuerying(false);
    }
  }, [searchTerm, setIsQuerying, handleEmpty]);
  return (
    <div className="border border-[#ddd] flex py-2 pl-3 pr-2 items-center min-w-[400px] rounded justify-between">
      <input
        className="text-sm outline-none pl-2 pr-2 w-full"
        type="search"
        placeholder={placeholder || "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button
        className="border border-black bg-black text-sm text-white flex items-center justify-center gap-1 cursor-pointer rounded px-5 py-1"
        onClick={() => setSearch(searchTerm)}
      >
        <FiSearch className="w-3" />
        Search
      </button>
    </div>
  );
};

export default Search;
