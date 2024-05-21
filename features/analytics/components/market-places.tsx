import React from "react";
import { DoughnutChart } from "./doughnut-chart";
import { sortDescending } from "@/lib/utils/sort-desending";
import { MandarinFlag, PunjabiFlag, USFlag } from "@/public/svg";

interface MarketPlaceProps {
  heading: string;
  subHeading: string;
  data: number[];
}

const colors = ["bg-[#000000]", "bg-[#7B7B7B]", "bg-[#BBBBBB]", "bg-[#F1F1F1]"];
const flags = [<USFlag />, <PunjabiFlag />, <MandarinFlag />, <PunjabiFlag />];
const countries = ["United States", "Punjabi", "Mandarin", "Punjabi"];
const MarketPlace: React.FC<MarketPlaceProps> = ({
  heading,
  subHeading,
  data,
}) => {
  return (
    <div className="bg-white rounded-md px-8 py-10 mt-8 overflow-x-auto">
      <p className="text-lg text-[#7b7b7b] font-[600] mb-4">
        {heading}
        <span className="text-[#7b7b7b] font-[400]"> {subHeading}</span>
      </p>

      <div className=" mb-6">
        <DoughnutChart percent={sortDescending(data)} />
      </div>

      <div className="flex flex-col gap-y-5 ml-3">
        {sortDescending(data).map((item, index) => (
          <div className="grid grid-cols-2 items-center gap-x-6">
            <div className="flex gap-x-3 items-center w-fit" key={index}>
              <div className={`w-4 h-4 ${colors[index]} rounded-2xl`}></div>
              <p className="font-[500]">{item}%</p>
            </div>
            <div className="flex gap-x-2 items-center min-w-[200px]">
              {flags[index]}
              <p className="">{countries[index]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPlace;
