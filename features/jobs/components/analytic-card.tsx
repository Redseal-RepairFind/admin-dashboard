"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { OpenedEye, ClosedEye } from "@/public/svg";

interface IProps {
  iconColor?: string;
  borderColor: string;
  icon?: React.ReactNode;
  imgSrc?: string;
  name: string;
  info: any;
  percentage?: any;
  mostReq?: any;
  quotes?: any;
  tip?: string;
  charge?: any;
}

const AnalyticCard: React.FC<IProps> = ({
  icon,
  imgSrc,
  borderColor,
  iconColor,
  name,
  info,
  percentage,
  mostReq,
  quotes,
  tip = "This is a tooltip",
  charge,
}) => {
  // const router = useRouter();

  const [showTip, setShowTip] = useState(false);
  const [] = useState();

  return (
    <div
      className={`bg-white py-3 px-6 flex flex-col w-[300px]  min-h-[120px] rounded-md 
    cursor-pointer hover:opacity-80 transition-all border-l-[3px] ${borderColor} text-[#333] relative`}
    >
      <div className="flex items-center justify-between">
        {typeof icon !== "string" && (
          <div
            className={`rounded-md ${iconColor} w-[30px] h-[30px] flex items-center justify-center`}
          >
            {icon}
          </div>
        )}

        {typeof icon === "string" && (
          <Image
            src={"/admin-pic.png"}
            width={40}
            height={40}
            alt=""
            className="rounded-[50%]"
          />
        )}
        <button
          onMouseEnter={() => setShowTip(true)}
          onMouseLeave={() => setShowTip(false)}
          className="transition-all duration-500"
        >
          {showTip ? <OpenedEye /> : <ClosedEye />}
        </button>

        {showTip ? <ToolTipCard tip={tip} /> : null}
      </div>
      <div className="flex items-center justify-between">
        <p className="py-3 text-sm">{name}</p>

        {quotes ? <p className="text-sm text-gray-500">{quotes}</p> : null}
      </div>
      <div className="flex items-center justify-between">
        <p className="font-[600]">{info}</p>

        {percentage || mostReq ? (
          <p className="font-semibold  text-gray-700">
            {percentage ? `${percentage}%` : mostReq}
          </p>
        ) : null}

        {charge || +charge === 0 ? (
          <p className="font-semibold  text-gray-700">{charge}</p>
        ) : null}
      </div>

      {/* <div className="flex flex-col">
        <span className="flex items-center gap-2">
          <p>Total Job Percentage:</p>
          <p className="font-semibold ">20</p>
        </span>
        <p className="font-semibold ">20</p>
      </div> */}
    </div>
  );
};

export default AnalyticCard;

type TIP = {
  tip: string;
};

function ToolTipCard({ tip }: TIP) {
  return (
    <div className="absolute right-[10px] top-[40px] bg-[white] px-4 py-2 rounded-md shadow-lg">
      <p className="text-sm font-bold text-gray-800">{tip}</p>
    </div>
  );
}
