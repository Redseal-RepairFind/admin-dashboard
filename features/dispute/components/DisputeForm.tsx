"use client";
import React, { useState } from "react";
import {
  FaCaretDown,
  FaCaretUp,
  FaLocationArrow,
  FaCalendar,
} from "react-icons/fa";

const DisputeForm = ({ info }: { info: any }) => {
  const [showData, setShowData] = useState(false);

  const handleToggle = () => setShowData(!showData);

  return (
    <div className="p-5 bg-white rounded-lg my-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Dispute Form</h1>
        <button onClick={handleToggle}>
          {showData ? <FaCaretUp /> : <FaCaretDown />}
        </button>
      </div>
      {showData && (
        <div className="w-full mt-4">
          <div className="p-4 bg-gray-100 text-sm font-medium rounded-md">
            {info}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeForm;
