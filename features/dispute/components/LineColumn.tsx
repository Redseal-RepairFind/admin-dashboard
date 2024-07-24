import React from "react";

interface IProps {
  name?: string;
  value: any;
}

const LineColumn: React.FC<IProps> = ({ name, value }) => {
  if (!name)
    return (
      <div className="border-b border-b-[#e7e6e6] w-full">
        <div className="text-sm font-[500] text-[#777] py-4 capitalize">
          {value}
        </div>
      </div>
    );
  return (
    <div className="border-b border-b-[#e7e6e6] w-full grid grid-cols-2 gap-2">
      <div className="text-sm font-[500] text-[#777] py-4 capitalize">
        {name}
      </div>
      <div className="font-[500] text-[15px] py-4 capitalize">{value}</div>
    </div>
  );
};

export default LineColumn;
