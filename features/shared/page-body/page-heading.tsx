import React from "react";

interface IProps {
  page_title: string;
}

// Page Heading On every pagee
const PageHeading: React.FC<IProps> = ({ page_title }) => {
  return <h1 className="text-[#777777] text-2xl">{page_title}</h1>;
};

export default PageHeading;
