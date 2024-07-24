"use client";
import React, { useState } from "react";
import {
  FaCaretDown,
  FaCaretUp,
  FaLocationArrow,
  FaCalendar,
} from "react-icons/fa";
import LineColumn from "./LineColumn";
import { convertDate } from "@/lib/utils/format-date";
import { GoogleMap, Marker } from "@react-google-maps/api";
import GoogleMapsEmbed from "@/components/ui/google-maps";

const JobDetail = ({ info }: { info: any }) => {
  const [showData, setShowData] = useState(false);

  const handleToggle = () => setShowData(!showData);

  const mapStyles = {
    height: "150px",
    width: "100%",
    border: "1px solid #ccc",
    padding: "5px",
  };

  const defaultCenter = {
    lng: info?.location?.longitude,
    lat: info?.location?.latitude,
  };

  return (
    <div className="p-5 bg-white rounded-lg my-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Job Detail</h1>
        <button onClick={handleToggle}>
          {showData ? <FaCaretUp /> : <FaCaretDown />}
        </button>
      </div>
      {showData && (
        <div className="w-full mt-4 border-t border-t-[#e7e6e6]">
          <LineColumn
            value={
              <div>
                <h1 className="font-semibold text-lg text-black">
                  {info?.category}
                </h1>
                <p className="mt-3">{info?.description}</p>
                <div className="flex items-center justify-between mt-8 px-4">
                  <span className="flex items-center justify-center gap-2">
                    <FaLocationArrow /> {info?.location?.address}
                  </span>
                  <span className="flex items-center justify-center gap-2">
                    <FaCalendar /> {convertDate(info?.date)}
                  </span>
                  <span className="flex items-center justify-center gap-2">
                    No. of Applicants: {info?.totalQuotations}
                  </span>
                  <span className="flex items-center justify-center gap-2">
                    Exp in {info?.expiresIn} days
                  </span>
                </div>
              </div>
            }
          />
          <LineColumn
            value={
              <div className="">
                <p className="font-semibold mb-2">Job Location</p>
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={13}
                  center={defaultCenter}
                >
                  <Marker position={defaultCenter} />
                </GoogleMap>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default JobDetail;
