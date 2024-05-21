import React from "react";

interface IProps {
  children: React.ReactNode;
}

const Thead: React.FC<IProps> = ({ children }) => {
  return <thead className="bg-[#F1F1F1]">{children}</thead>;
};

export default Thead;
