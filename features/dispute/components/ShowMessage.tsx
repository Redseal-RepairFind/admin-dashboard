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
            className="w-full h-fit duration-200 hover:opacity-50 hover:blur-sm cursor-pointer relative"
          >
            {message?.media?.map((item: any, index: number) => (
              <Image
                key={index}
                src={item?.url}
                width={100}
                height={100}
                alt="Image"
                className="h-[150px] object-contain"
              />
            ))}
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
                    src={item?.url}
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
          <div className="w-full h-[200px] duration-200 hover:opacity-50 hover:blur-sm cursor-pointer relative">
            <p className="mb-3">{message?.message}</p>
            {message?.media?.map((item: any, index: number) => (
              <video
                key={index}
                controls
                style={{ maxWidth: "100%", height: "auto" }}
              >
                <source src={item?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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
