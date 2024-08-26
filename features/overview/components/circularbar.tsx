import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularBar = ({
  value,
  text,
  label,
  pathColor,
}: {
  value: any;
  text: any;
  label: any;
  pathColor: any;
}) => {
  return (
    <div className="w-full h-full">
      <CircularProgressbar
        value={value}
        text={`${text}`}
        strokeWidth={5}
        styles={buildStyles({
          pathColor: `${pathColor}`,
          textColor: "#000",
          trailColor: "#d6d6d6",
        })}
      />
        <p className="w-full flex items-center justify-center">{label}</p>
    </div>
  );
};

export default CircularBar;
