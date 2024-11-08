"use client";

import React, { useState } from "react";
import { MdOutlineAttachment } from "react-icons/md";
import { CiText } from "react-icons/ci";
import { useDropzone } from "react-dropzone";

const ChatBox = ({
  message,
  setMessage,
  isText,
  setIsText,
  fileName,
  setFileName,
}: {
  message: any;
  setMessage: any;
  isText: boolean;
  setIsText: any;
  fileName: string;
  setFileName: any;
}) => {
  // const [fileName, setFileName] = useState("");
  // const [isText, setIsText] = useState(true);

  const onDrop = (acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFileName(file.name);
      setMessage(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png"],
      "video/*": [".mp4", ".mov"],
    },
    maxFiles: 1, // Allow only one file to be dropped
  });

  // Function to clear input after sending the message
 
  return (
    <div className="w-full relative">
      {isText ? (
        <input
          value={typeof message === "string" ? message : ""}
          onChange={(e) => setMessage(e.target.value)}
          className="py-3 rounded-md px-4 outline-none focus:ring-0 focus:border-black duration-200 w-full border border-gray-200"
          placeholder="Send a message..."
        />
      ) : (
        <div
          {...getRootProps()}
          className="w-full cursor-pointer py-3 px-4 border border-gray-200 rounded-md flex items-center justify-center"
        >
          {fileName === "" ? (
            <>
              <input {...getInputProps()} />
              <p className="text-gray-500">Click here to upload your file...</p>
            </>
          ) : (
            <p>{fileName}</p>
          )}
        </div>
      )}
      <button
        onClick={() => {
          setFileName("");
          setMessage("");
          setIsText((isText: boolean) => !isText);
        }}
        className="cursor-pointer absolute top-[50%] translate-y-[-50%] right-2"
      >
        {!isText ? (
          <CiText className="w-7" />
        ) : (
          <MdOutlineAttachment className="w-7" />
        )}
      </button>
    </div>
  );
};

export default ChatBox;
