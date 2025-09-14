import React from "react";

interface StatCardProps {
  heading: string;
  subHeading: string;
  number: string;
}

const StatCard: React.FC<StatCardProps> = ({ heading, subHeading, number }) => {
  return (
    <div className="">
      <p className="text-xl text-[#333] font-[500] flex flex-col lg:flex-row lg:items-center gap-x-1">
        {heading}
        <span className="text-xs text-[#999]">{subHeading}</span>
      </p>

      <p className="my-6 text-3xl font-[500]">{number}</p>

      <button
        type="button"
        className="text-[#666] underline underline-offset-8"
      >
        View jobs
      </button>
    </div>
  );
};

export default StatCard;
