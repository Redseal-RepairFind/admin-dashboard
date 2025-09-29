import React from "react";

interface IProps {
  name: string;
}

const Heading: React.FC<IProps> = ({ name }) => {
  return <h2 className="font-[600] text-lg whitespace-nowrap">{name}</h2>;
};

export default Heading;
