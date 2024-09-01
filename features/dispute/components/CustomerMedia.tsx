"use client";

import React, { useState, useRef } from "react";
import Img from "./Img";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Image from "next/image";

const CustomerMedia = ({ data }: { data: any }) => {
  const [open, setOpen] = useState<boolean>(false);

  const [currentImg, setCurrentImg] = useState<string>("");

  const modalRef = useRef(null);

  return (
    <>
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
          <Image
            src={currentImg}
            width={500}
            height={500}
            alt="Image"
            className="h-[400px] object-contain"
          />
        </div>
      </Modal>

      <div className="p-2">
        <h1 className="underline">Pictures before job started</h1>
        <div className="mt-2 mb-5 grid md:grid-cols-4 grid-cols-1">
          {data?.preMedia?.map((url: any, index: number) => (
            <div
              onClick={() => {
                setOpen(true);
                setCurrentImg(url);
              }}
              className="cursor-zoom-in flex items-start justify-start"
              key={index}
            >
              <Img url={url} />
            </div>
          ))}
        </div>
        <h1 className="underline">Pictures after job ended</h1>
        <div className="mt-2 mb-5 grid md:grid-cols-4 grid-cols-1">
          {data?.postMedia?.map((url: any, index: number) => (
            <div
              onClick={() => {
                setOpen(true);
                setCurrentImg(url);
              }}
              className="cursor-pointer flex items-start justify-start"
              key={index}
            >
              <Img url={url} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomerMedia;
