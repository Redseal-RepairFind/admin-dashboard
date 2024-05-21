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
  info: string;
}

const AnalyticCard: React.FC<IProps> = ({
  icon,
  imgSrc,
  borderColor,
  iconColor,
  name,
  info,
}) => {
  // const router = useRouter();
  return (
    <div
      className={`bg-white py-3 px-6 flex flex-col w-[260px] min-h-[120px] rounded-md 
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

      <p className="py-3 text-sm">{name}</p>

      <p className="font-[600]">{info}</p>
    </div>
  );
};

export default AnalyticCard;
