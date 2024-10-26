"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

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
}) => {
  // const router = useRouter();
  return (
    <div
      className={`bg-white py-3 px-6 flex flex-col w-[300px]  min-h-[120px] rounded-md 
    cursor-pointer hover:opacity-80 transition-all border-l-[3px] ${borderColor} text-[#333]`}
    >
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
