import React from "react";

interface IProps {
  children: React.ReactNode;
}

const TableOverflow: React.FC<IProps> = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto relative min-h-60 overflow-y-visible z-10">
      {children}
    </div>
  );
};

export default TableOverflow;
