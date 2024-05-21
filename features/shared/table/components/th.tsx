import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Th: React.FC<IProps> = ({ children }) => {
  return <th className="font-[500] px-5 py-3">{children}</th>;
};

export default Th;
