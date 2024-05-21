"use client";
import { useRouter } from "next/navigation";
import React from "react";
import CountUp from "react-countup";

interface IProps {
  svgColor: string;
  svg: React.ReactNode;
  name: string;
  numbers: number;
  percent: number;
  route: string;
}

const AnalyticCard: React.FC<IProps> = ({
  svg,
  svgColor,
  name,
  numbers,
  percent,
  route,
}) => {
  const router = useRouter();
  return (
    <div
      className="bg-white p-3 flex flex-col w-[260px] min-h-[120px] rounded-md cursor-pointer hover:opacity-80 transition-all"
      onClick={() => router.push(route)}
    >
      <div
        className={`rounded-md ${svgColor} w-[30px] h-[30px] flex items-center justify-center`}
      >
        {svg}
      </div>
      <p className="py-4 text-sm">{name}</p>
      <div className="flex justify-between">
        <div className="font-[600]">
          {name === "Total Revenue" && "$ "}
          <CountUp start={0} end={+numbers} duration={5} />
        </div>

        <div className="hidden gap-2">
          {percent > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19.71 9.71L22 12V6H16L18.29 8.29L14.12 12.46C14.0275 12.5527 13.9176 12.6263 13.7966 12.6764C13.6757 12.7266 13.546 12.7524 13.415 12.7524C13.284 12.7524 13.1543 12.7266 13.0334 12.6764C12.9124 12.6263 12.8025 12.5527 12.71 12.46L11.54 11.29C10.9775 10.7282 10.215 10.4126 9.42 10.4126C8.625 10.4126 7.8625 10.7282 7.3 11.29L2 16.59L3.41 18L8.7 12.71C8.79251 12.6173 8.9024 12.5437 9.02338 12.4936C9.14435 12.4434 9.27403 12.4176 9.405 12.4176C9.53597 12.4176 9.66565 12.4434 9.78662 12.4936C9.9076 12.5437 10.0175 12.6173 10.11 12.71L11.28 13.88C11.8425 14.4418 12.605 14.7574 13.4 14.7574C14.195 14.7574 14.9575 14.4418 15.52 13.88L19.71 9.71Z"
                fill="#0D8012"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M16 18L18.29 15.71L13.41 10.83L9.41 14.83L2 7.41L3.41 6L9.41 12L13.41 8L19.71 14.29L22 12V18H16Z"
                fill="#9A0101"
              />
            </svg>
          )}
          <p
            className={`font-[500]  ${
              percent > 0 ? "text-[#0D8012]" : "text-[#9A0101]"
            }`}
          >
            {percent}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticCard;
