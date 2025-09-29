import { HeaderSearch } from "@/public/svg";
import React from "react";

const Searchbar = () => {
  return (
    <div className="bg-white flex px-3 py-2 items-center min-w-[260px] rounded justify-between">
      <input
        className="text-sm outline-none w-full pr-4"
        type="search"
        placeholder="Search here"
      />
      <HeaderSearch />
    </div>
  );
};

export default Searchbar;
