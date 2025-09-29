import React from "react";

interface IProps {
  children: React.ReactNode;
}

//  Page Body - Use for side padding on the top and sides
const PageBody: React.FC<IProps> = ({ children }) => {
  return <div className="px-[3vw] pt-9">{children}</div>;
};

export default PageBody;
