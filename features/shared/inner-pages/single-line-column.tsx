import React from "react";

interface IProps {
  name: string;
  value: string;
}

const SingleLineColumn: React.FC<IProps> = ({ name, value }) => {
  return (
    <tr className="border-b border-b-[#ddd]">
      <td className="text-sm font-[500] text-[#777] py-4 capitalize">{name}</td>
      <td className="font-[500] text-[15px] py-4 capitalize">{value}</td>
    </tr>
  );
};

export default SingleLineColumn;
