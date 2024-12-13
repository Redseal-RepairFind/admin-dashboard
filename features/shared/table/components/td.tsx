import React from "react";

interface IProps {
  children: React.ReactNode;
  className?: string; // optional prop for additional classes on td element
}

const Td: React.FC<IProps> = ({ children, className }) => {
  return (
    <td
      className={`px-5 py-4 text-sm capitalize max-w-[300px] overflow-x-auto ${className}`}
    >
      {children}
    </td>
  );
};

export default Td;
