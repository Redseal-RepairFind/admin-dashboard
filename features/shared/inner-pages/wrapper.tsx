import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<IProps> = ({ children }) => {
  return <div className="px-[5vw] max-w-[1280px] mx-auto">{children}</div>;
};

export default Wrapper;
