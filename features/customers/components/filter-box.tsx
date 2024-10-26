"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface IProps {
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  availableYears: number[];
}

const FilterBox: React.FC<IProps> = ({ setShowFilters, availableYears }) => {
  const [dropDateSelect, setDropDateSelect] = useState(false);
  const [dropRatingSelect, setDropRatingSelect] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Set initial filter values from the URL
  const initialStatus = searchParams.get("status") || "All";
  const initialType = searchParams.get("type") || "All";
  const [status, setStatus] = useState(initialStatus);
  const [type, setType] = useState(initialType);

  // Update URL and state when status filter is changed
  const handleStatusChange = (value: string) => {
    updateUrlParams("status", value);
    setStatus(value);
  };

  // Update URL and state when type filter is changed
  const handleTypeChange = (value: string) => {
    updateUrlParams("type", value);
    setType(value);
  };

  // Clear all filters
  const clearFilter = () => {
    router.replace(`${pathname}`);
    setStatus("All");
    setType("All");
    setShowFilters(false);
  };

  // Helper function to update URL parameters
  function updateUrlParams(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value === "All") {
      params.delete(key); // Remove the param if the default option is selected
    } else {
      params.set(key, value); // Set the selected filter in query params
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const statusOptions = [
    "PENDING",
    "APPROVED",
    "SUCCESSFUL",
    "FAILED",
    "REFUNDED",
    "CANCELLED",
  ];

  const typeOptions = [
    { label: "TRANSFER", param: "TRANSFER" },
    { label: "REFUND", param: "REFUND" },
    { label: "ESCROW", param: "ESCROW" },
    { label: "SITE VISIT PAYMENT", param: "SITE_VISIT_PAYMENT" },
    { label: "JOB DAY PAYMENT", param: "JOB_DAY_PAYMENT" },
    { label: "CHANGE ORDER PAYMENT", param: "CHANGE_ORDER_PAYMENT" },
    { label: "REFERRAL BONUS", param: "REFERAL_BONUS_PAYMENT" },
  ];

  return (
    <>
      <div>
        <button
          type="button"
          className="font-[500] text-[#555] border border-[#555] py-1 w-full rounded-md text-center outline-none"
          onClick={() => setDropDateSelect(!dropDateSelect)}
        >
          Transaction Status
        </button>

        {dropDateSelect && (
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <label className="mb-1 block">Select Status:</label>
              <div className="bg-[#f0f0f0] pl-2 pr-2 py-1 rounded-md">
                <select
                  value={status}
                  className="bg-transparent pr-2 outline-none w-full"
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="All">All</option>
                  {statusOptions.map((statusItem) => (
                    <option key={statusItem} value={statusItem}>
                      {statusItem}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          className="font-[500] text-[#555] border border-[#555] py-1 w-full rounded-md text-center outline-none mt-4 mb-1"
          onClick={() => setDropRatingSelect(!dropRatingSelect)}
        >
          Transaction Types
        </button>

        {dropRatingSelect && (
          <div className="flex flex-col gap-4 mt-3">
            <div>
              <label className="mb-1 block">Select Type:</label>
              <div className="bg-[#f0f0f0] pl-2 pr-2 py-1 rounded-md">
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="bg-transparent pr-2 outline-none w-full"
                >
                  <option value="All">All</option>
                  {typeOptions.map((typeOption) => (
                    <option key={typeOption.label} value={typeOption.param}>
                      {typeOption.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="font-[500] text-[#fff] border border-[#555] py-1 w-full rounded-md text-center outline-none mt-4 bg-[#555]/70"
        onClick={clearFilter}
      >
        Clear
      </button>
    </>
  );
};

export default FilterBox;
