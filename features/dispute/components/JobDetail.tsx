"use client";
import React from "react";
import { FaLocationArrow, FaCalendar } from "react-icons/fa";
import LineColumn from "./LineColumn";
import { convertDate } from "@/lib/utils/format-date";
import GoogleMapsEmbed from "@/components/ui/google-maps";
import SectionContainer from "./SectionContainer";

const JobDetail = ({ info }: { info: any }) => {
  return (
    <SectionContainer title="Job Detail">
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
              <div className="w-full">
                <GoogleMapsEmbed
                  coords={{
                    longitude: info?.location?.longitude,
                    latitude: info?.location?.latitude,
                  }}
                />
              </div>
            </div>
          }
        />
      </div>
    </SectionContainer>
  );
};

export default JobDetail;
