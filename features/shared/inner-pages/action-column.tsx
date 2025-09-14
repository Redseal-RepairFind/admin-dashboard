import React from "react";

interface IProps {
  children: React.ReactNode;
}

const ActionColumn: React.FC<IProps> = ({ children }) => {
  return (
    <tr className="border-b border-b-[#ddd]">
      <td className="text-sm font-[500] text-[#777] py-4">Actions</td>
      <td className="font-[500] text-[15px] py-4">{children}</td>
    </tr>
  );
};

export default ActionColumn;
