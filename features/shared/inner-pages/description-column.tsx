import React from "react";

interface IProps {
  name: string;
  text: string;
}

const DescriptionColumn: React.FC<IProps> = ({ name, text }) => {
  return (
    <tr className="border-b border-b-[#ddd]">
      <td className="text-sm font-[500] text-[#777] py-4 capitalize">{name}</td>
      <td className="font-[500] text-[15px] py-4 max-w-[500px] whitespace-break-spaces capitalize">
        {text}
      </td>
    </tr>
  );
};

export default DescriptionColumn;
