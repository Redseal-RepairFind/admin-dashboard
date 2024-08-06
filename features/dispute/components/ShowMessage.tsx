/* eslint-disable @next/next/no-img-element */
import React from "react";
import Img from "./Img";

const ShowMessage = ({
  type,
  message,
}: {
  type: "IMAGE" | "VIDEO" | "TEXT";
  message: any;
}) => {
  const renderContent = () => {
    switch (type) {
      case "IMAGE":
        return (
          <div className="w-full h-fit">
            {message?.media?.map((item: any, index: number) => (
              <img
                key={index}
                src={item?.url}
                alt="Image"
                className="h-[150px] object-contain"
              />
            ))}
          </div>
        );
      case "VIDEO":
        return (
          <video controls style={{ maxWidth: "100%", height: "auto" }}>
            <source src={message?.media?.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "TEXT":
        return message?.message;
      default:
        return null;
    }
  };
  return <div>{renderContent()}</div>;
};

export default ShowMessage;
