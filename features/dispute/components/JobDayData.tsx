"use client";
import React from "react";
import LineColumn from "./LineColumn";
import { formatTimeDDMMYY } from "@/lib/utils/format-date";
import GoogleMapsEmbed from "@/components/ui/google-maps";
import SectionContainer from "./SectionContainer";

const JobDayData = ({ info }: { info: any }) => {
  // console.log(info);
  const defaultCenter = {
    longitude: info?.jobLocation?.longitude,
    latitude: info?.jobLocation?.latitude,
  };

  const defaultContractorCenter = {
    longitude: info?.contractorLocation?.longitude,
    latitude: info?.contractorLocation?.latitude,
  };

  return (
    <SectionContainer title="Job Day Data">
      <div className="w-full pb-5 mt-4 border-t border-t-[#e7e6e6]">
        <LineColumn
          name="Date & Time Contractor Initiated Job"
          value={formatTimeDDMMYY(info?.createdAt, true)}
        />
        <LineColumn
          // name="Job Location"
          value={
            <div className="w-full">
              <div className="flex gap-6 items-center">
                <p className="font-semibold mb-2">Job Location</p>
                <p className="font-semibold mb-2">
                  {info?.jobLocation?.address}
                </p>
              </div>
              <GoogleMapsEmbed coords={defaultCenter} />
            </div>
          }
        />
        <LineColumn
          // name="çLocation"
          value={
            <div className="">
              <div className="flex gap-6 items-center">
                <p className="font-semibold mb-2">Contractor's Location</p>
                <p className="font-semibold mb-2">
                  {info?.contractorLocation?.address}
                </p>
              </div>

              <GoogleMapsEmbed coords={defaultContractorCenter} />
            </div>
          }
        />
        <LineColumn
          name="Date & Time Contractor Updated Job"
          value={formatTimeDDMMYY(info?.updatedAt, true)}
        />
      </div>
    </SectionContainer>
  );
};

export default JobDayData;
