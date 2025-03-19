import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Table: React.FC<IProps> = ({ children }) => {
  return (
    <table className="w-full text-left relative whitespace-nowrap mt-6 overflow-y-visible z-10">
      {children}
    </table>
  );
};

export default Table;
