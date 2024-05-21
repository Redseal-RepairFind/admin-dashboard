"use client";
import { FilterIcon } from "@/public/svg";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";
import React, { useRef, useState } from "react";

interface IProps {
  showFilters?: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

const Filter: React.FC<IProps> = ({
  children,
  showFilters,
  setShowFilters,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleShowFilters = () => {
    if (setShowFilters) setShowFilters(!showFilters);
  };
  useOnClickOutside(ref, handleShowFilters);
  return (
    <div className="relative">
      <div
        className="flex gap-9 bg-[#F1F1F1] p-2 cursor-pointer"
        onClick={() => setShowFilters && setShowFilters(!showFilters)}
      >
        <p className="whitespace-nowrap">Filter by</p>
        <FilterIcon />
      </div>
      <div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              ref={ref}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="px-5 py-3 bg-white flex flex-col gap-1 absolute min-w-[250px]
        top-[50px] right-0 z-10 rounded-[8px] options-shadow"
            >
              <button
                className="self-end mb-4"
                onClick={() => setShowFilters(false)}
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  fill="#333"
                  height={16}
                  width={16}
                >
                  <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                </svg>
              </button>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Filter;
