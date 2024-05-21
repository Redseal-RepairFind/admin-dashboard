import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Td: React.FC<IProps> = ({ children }) => {
  return <td className="px-5 py-4 text-sm capitalize">{children}</td>;
};

export default Td;
