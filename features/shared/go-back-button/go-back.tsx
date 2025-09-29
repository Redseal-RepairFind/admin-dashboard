"use client";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5"
import React from "react";

const GoBack = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      className="font-[600] text-[#777] flex items-center"
      onClick={() => router.back()}
    >
      <span className="mr-2"><IoChevronBack/></span>
      Back
    </button>
  );
};

export default GoBack;
