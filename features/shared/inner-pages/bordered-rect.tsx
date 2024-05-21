import React from "react";

interface IProps {
  children: React.ReactNode;
}

const BorderRectangle: React.FC<IProps> = ({ children }) => {
  return <div className="border border-[#ddd] p-6">{children}</div>;
};

export default BorderRectangle;
