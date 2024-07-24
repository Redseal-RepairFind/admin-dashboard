"use client";
import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import LineColumn from "./LineColumn";
import { convertDate } from "@/lib/utils/format-date";
import { GoogleMap, Marker } from "@react-google-maps/api";
import GoogleMapsEmbed from "@/components/ui/google-maps";

const JobDayData = ({ info }: { info: any }) => {
  const [showData, setShowData] = useState(false);

  const handleToggle = () => setShowData(!showData);

  const mapStyles = {
    height: "150px",
    width: "100%",
    border: "1px solid #ccc",
    padding: "5px",
  };

  const defaultCenter = {
    lng: info?.jobLocation?.longitude,
    lat: info?.jobLocation?.latitude,
  };

  const defaultContractorCenter = {
    lng: info?.contractorLocation?.longitude,
    lat: info?.contractorLocation?.latitude,
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
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={13}
                  center={defaultCenter}
                >
                  <Marker position={defaultCenter} />
                </GoogleMap>
                {/* <GoogleMapsEmbed
                  coords={{
                    latitude: info?.jobLocation?.latitude,
                    longitude: info?.jobLocation?.longitude,
                    latitude:53.2734,
                  }}
                /> */}
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
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={13}
                  center={defaultContractorCenter}
                >
                  <Marker position={defaultContractorCenter} />
                </GoogleMap>
                {/* <GoogleMapsEmbed
                  coords={{
                    latitude: info?.jobLocation?.latitude,
                    longitude: info?.jobLocation?.longitude,
                    latitude:53.2734,
                  }}
                /> */}
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
