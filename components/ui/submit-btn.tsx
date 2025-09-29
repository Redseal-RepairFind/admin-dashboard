"use client";

import React from "react";
import { ClipLoader } from "react-spinners";

function SubmitBtn({
  isSubmitting,
  children,
  onClick,
  spaceUp = "mt-5",
}: {
  isSubmitting: boolean;
  children: any;
  onClick?: any;
  spaceUp?: string;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`flex w-full border border-[#000000] justify-center bg-[#000000] ${spaceUp}  rounded-md py-3 text-sm font-medium  text-white`}
      onClick={onClick}
    >
      {isSubmitting ? <ClipLoader size={20} color="#ffffff" /> : children}
    </button>
  );
}

export default SubmitBtn;
