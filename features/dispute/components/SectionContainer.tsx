"use client";
import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const JobDayData = ({
  children,
  title,
  className = "bg-white",
}: {
  children: any;
  title: string;
  className?: string;
}) => {
  const [showData, setShowData] = useState(false);

  const handleToggle = () => setShowData(!showData);

  return (
    <div className={`px-5 ${className}  rounded-lg my-4`}>
      <div
        onClick={handleToggle}
        className="flex py-5 cursor-pointer items-center justify-between"
      >
        <h1 className="font-semibold">{title}</h1>
        <span>{showData ? <FaCaretUp /> : <FaCaretDown />}</span>
      </div>
      {showData && children}
    </div>
  );
};

export default JobDayData;
