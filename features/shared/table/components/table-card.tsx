import React from "react";

interface IProps {
  children: React.ReactNode;
}

const TableCard: React.FC<IProps> = ({ children }) => {
  return <div className="bg-white p-6 mb-10 rounded w-full">{children}</div>;
};

export const BorderedTableCard: React.FC<IProps> = ({ children }) => {
  return (
    <div className="border border-[#ddd] p-6 mb-10 rounded w-full">
      {children}
    </div>
  );
};

export default TableCard;
