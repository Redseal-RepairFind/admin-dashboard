import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Header: React.FC<IProps> = ({ children }) => {
  return <div className="bg-[#F1F1F1] py-8  px-6 sticky top-0">{children}</div>;
};

export default Header;
