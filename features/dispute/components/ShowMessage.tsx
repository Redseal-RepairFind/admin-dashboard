/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import Img from "./Img";
import { FaEye } from "react-icons/fa";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import {
  CompletedState,
  PendingState,
  SuspendedState,
  RatingStar,
  YellowStar,
} from "@/public/svg";
import Image from "next/image";

function validateUrl(url: string) {
  // Regular expression to validate URL starting with https://
  const urlPattern = /^https:\/\/[^\s/$.?#].[^\s]*$/i;

  // Test the URL against the pattern
  if (urlPattern.test(url)) {
    return url;
  } else {
    return null;
  }
}

const ShowMessage = ({
  type,
  message,
}: {
  type: "IMAGE" | "VIDEO" | "TEXT" | "ALERT" | "FILE" | "MEDIA";
  message: any;
}) => {
  // console.log(message);

  const [open, setOpen] = useState<boolean>(false);

  const modalRef = useRef(null);
  const renderContent = () => {
    switch (type) {
      case "IMAGE":
        return (
          <div
            onClick={() => setOpen(!open)}
            className="w-full h-fit duration-200 cursor-zoom-in relative"
          >
            {message?.media?.map((item: any, index: number) =>
              validateUrl(item?.url) ? (
                <Image
                  key={index}
                  src={`${validateUrl(item?.url)}`}
                  width={100}
                  height={100}
                  alt="Image"
                  className="h-[150px] object-contain"
                />
              ) : null
            )}
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              center
              classNames={{
                modal: "customModal",
              }}
              container={modalRef.current}
            >
              <div className="mt-[40px]">
                {message?.media?.map((item: any, index: number) => (
                  <img
                    key={index}
                    src={`${validateUrl(item?.url)}`}
                    alt="Image"
                    className="h-[400px] object-contain"
                  />
                ))}
              </div>
            </Modal>
          </div>
        );
      case "VIDEO":
        return (
          <div className="w-full max-h-[200px] duration-200 cursor-pointer relative">
            <p className="mb-3">{message?.message}</p>
            {message?.media?.map((item: any, index: number) => (
              <div
                className="w-full h-[200px] flex justify-center items-center overflow-hidden"
                key={index}
              >
                <video className="h-full w-auto" controls>
                  <source src={`${validateUrl(item?.url)}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        );
      case "TEXT":
        return message?.message;
      case "MEDIA":
        return (
          <span>
            {message?.message}
            {message?.media?.map?.((item: any, index: number) => (
              <video controls className="w-full my-1 h-[100px]" key={index}>
                <source src={`${item?.url}`} />
              </video>
            ))}
          </span>
        );
      case "ALERT":
        return (
          <span className="flex items-center gap-1">
            <SuspendedState />
            {message?.message}
          </span>
        );
      case "FILE":
        return message?.message;
      default:
        return null;
    }
  };
  return <div>{renderContent()}</div>;
};

export default ShowMessage;
