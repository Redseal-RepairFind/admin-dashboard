import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { RatingStar, YellowStar } from "@/public/svg";
import Image from "next/image";
import React from "react";

interface IProps {
  name: string;
  skill: string;
  number: number;
}

const ContractorCard: React.FC<IProps> = ({ name, skill, number }) => {
  return (
    <div className="flex gap-4 min-w-[310px]">
      <Image
        src="/contractor-logo.png"
        width={70}
        height={70}
        className="rounded-[70px]"
        alt=""
      />

      <div className="flex flex-col justify-between ">
        <p className="font-[600]">{name}</p>
        <p className="font-[400] text-sm">{skill}</p>
        <div className="flex gap-x-1 pb-1">
          {filledArrayFromNumber(number).map((_, index) => (
            <YellowStar key={index} />
          ))}
          {filledArrayFromNumber(5 - number).map((_, index) => (
            <RatingStar key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractorCard;
