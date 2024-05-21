import React from "react";

interface IProps {
  children: React.ReactNode;
}

const TableOverflow: React.FC<IProps> = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto overflow-y-visible">{children}</div>
  );
};

export default TableOverflow;
