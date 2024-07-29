"use client";
import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import LineColumn from "./LineColumn";
import { convertDate } from "@/lib/utils/format-date";
import GoogleMapsEmbed from "@/components/ui/google-maps";

const JobDayData = ({ info }: { info: any }) => {
  const [showData, setShowData] = useState(false);

  const handleToggle = () => setShowData(!showData);

  const defaultCenter = {
    longitude: info?.jobLocation?.longitude,
    latitude: info?.jobLocation?.latitude,
  };

  const defaultContractorCenter = {
    longitude: info?.contractorLocation?.longitude,
    latitude: info?.contractorLocation?.latitude,
  };

  return (
    <div className="p-5 bg-white rounded-lg my-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Job Day Data</h1>
        <button onClick={handleToggle}>
          {showData ? <FaCaretUp /> : <FaCaretDown />}
        </button>
      </div>
      {showData && (
        <div className="w-full mt-4 border-t border-t-[#e7e6e6]">
          <LineColumn
            name="Date & Time Contractor Initiated Job"
            value={convertDate(info?.createdAt)}
          />
          <LineColumn
            name="Job Location"
            value={
              <div className="">
                <p className="font-semibold mb-2">
                  {info?.jobLocation?.address}
                </p>
                <GoogleMapsEmbed coords={defaultCenter} />
              </div>
            }
          />
          <LineColumn
            name="Contractor's Location"
            value={
              <div className="">
                <p className="font-semibold mb-2">
                  {info?.jobLocation?.address}
                </p>
                <GoogleMapsEmbed coords={defaultContractorCenter} />
              </div>
            }
          />
          <LineColumn
            name="Date & Time Contractor Updated Job"
            value={convertDate(info?.updatedAt)}
          />
        </div>
      )}
    </div>
  );
};

export default JobDayData;
