import React from "react";
import { ClipLoader } from "react-spinners";

function SubmitBtn({
  isSubmitting,
  children,
}: {
  isSubmitting: boolean;
  children: any;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`flex w-full border border-[#000000] justify-center bg-[#000000] mt-5 rounded-md py-3 text-sm font-medium  text-white`}
    >
      {isSubmitting ? <ClipLoader size={20} color="#ffffff" /> : children}
    </button>
  );
}

export default SubmitBtn;
