"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";

interface IProps {
  options?: string[];
  handleClick: (option: string, e: React.MouseEvent) => void;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultOptions = ["Validate Sub Admin"];

const Options: React.FC<IProps> = ({
  options = defaultOptions,
  handleClick,
  setShowOptions,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleShowOptions = () => {
    setShowOptions(false);
  };
  useOnClickOutside(ref, handleShowOptions);
  return (
    <motion.div
      ref={ref}
      onClick={() => handleShowOptions()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="px-5 py-3 bg-white flex flex-col gap-4 absolute 
      -top-[10px] right-20 z-50 rounded-[8px] options-shadow"
    >
      {options?.map((option, index) => (
        <button
          onClick={(e) => handleClick(option, e)}
          key={index}
          className="bg-transparent border-b border-b-[#e9e9e9da] 
          py-[6px] text-xs min-w-[150px] text-left text-[#8F8F8F] font-[500]"
        >
          {option}
        </button>
      ))}
    </motion.div>
  );
};
export default Options;
