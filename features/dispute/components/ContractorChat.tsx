"use client";

import React, { useState, useEffect } from "react";
import useDisputes from "@/lib/hooks/useDisputes";
import { useQuery } from "react-query";
import { dispute } from "@/lib/api/dispute";
import toast from "react-hot-toast";
import { ClipLoader, SyncLoader } from "react-spinners";
import io, { Socket } from "socket.io-client";
import ChatBox from "./ChatMessageBox";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import ShowMessage from "./ShowMessage";

const config = {
  bucketName: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
};

const CustomerChat = ({ refetch: refetchConversation }: { refetch?: any }) => {
  const { conversations, singleDispute, SendMessage } = useDisputes();

  const [message, setMessage] = useState<any>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean>(false);

  const id = singleDispute?.data?.conversations?.arbitratorContractor?._id;

  // console.log(singleDispute);

  const {
    data: contractorChat,
    isLoading,
    refetch,
  } = useQuery(
    ["Contractor Arbitrator Conversation"],
    () => dispute.getConversationMessages(id),
    {
      cacheTime: 100,
      staleTime: 100,
      refetchOnWindowFocus: true,
      enabled: Boolean(singleDispute),
      select: (data) => data?.data,
    }
  );

  // console.log(contractorChat, "contractor");

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

  const uploadMultimedia = async () => {
    AWS.config.update({
      region: config.region,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    if (!config.bucketName) {
      console.error("Bucket name is not defined.");
      return;
    }

    const params = {
      Bucket: config.bucketName,
      Key: `images/${uuidv4()}`,
      Body: message,
    };

    setIsSubmitting(true);

    s3.upload(params)
      .promise()
      .then(async (response: any) => {
        // console.log(response);

        const payload = {
          type: message?.type.includes("image") ? "IMAGE" : "VIDEO",
          media: [{ url: response?.Location }],
        };

        try {
          await SendMessage({ id, payload });
          setMessage("");
          setIsSubmitting(false);
          setTimeout(() => {
            refetch();
          }, 100);
        } catch (e: any) {
          setIsSubmitting(false);
          toast.error(e?.response?.data?.message);
        }
      });
  };

  const handleMessage = async () => {
    if (!message) return toast.error("Kindly type in a message...");

    if (typeof message === "object") return uploadMultimedia();

    const payload = { type: "TEXT", message };

    // toast.loading("Processing...");
    setIsSubmitting(true);
    try {
      const response = await SendMessage({ id, payload });
      // toast.success(response?.message);
      setMessage("");
      setIsSubmitting(false);
      setTimeout(() => {
        refetch();
      }, 100);
    } catch (e: any) {
      //   console.log({ e });
      setIsSubmitting(false);
      toast.error(e?.response?.data?.message);
    }
  };

  //   console.log(singleDispute);

  const token = sessionStorage.getItem("userToken");

  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    let socket: Socket;

    if (token) {
      socket = io(`${url}`, {
        extraHeaders: {
          token,
        },
      });

      const triggerConversationRead = () => {
        const data = { conversationId: id }; // Replace with relevant data
        socket.emit("send_mark_conversation_as_read", data);
        console.log("send_mark_conversation_as_read event triggered:", data);
      };

      socket.on("connect", () => {
        console.log("connected to server");
        // Trigger the event immediately (or based on some condition)
        triggerConversationRead();
        setIsRead(true);
        setTimeout(() => {
          refetchConversation();
        }, 1000);
      });

      socket.on("NEW_UNREAD_MESSAGE", (data: any) => {
        console.log("Received conversation event:", data);
        setTimeout(() => {
          refetch();
        }, 800);
      });

      socket.on("Conversation", (data) => {
        console.log("Conversation read event received:", data);
        setTimeout(() => {
          triggerConversationRead();
          refetch();
        }, 800);
      });

      socket.on("CONVERSATION_READ", (data) => {
        console.log("Conversation read event received:", data);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
        setIsRead(false);
      });

      socket.on("error", (error: any) => {
        console.error("Socket.IO error:", error);
        setIsRead(false);
      });
    }

    return () => {
      if (socket) {
        setIsRead(false);
        socket.off("CONVERSATION_READ");
        socket.disconnect();
      }
    };
  }, [token]);

  return (
    <div className="md:w-[700px] mx-2 w-full mt-10">
      <div className="bg-gray-100 flex items-center justify-start gap-4 rounded-md py-5 px-3">
        <h1 className="font-medium">Contractor Chat with</h1>
        <div className="bg-white p-3 rounded-md flex items-center justify-between">
          <div className="px-5">
            <p className="font-semibold">
              {singleDispute?.data?.contractor?.firstName}{" "}
              {singleDispute?.data?.contractor?.lastName}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 p-5 border border-gray-300 h-[50vh] overflow-y-scroll">
        {isLoading && !isRead && (
          <div className="w-full flex items-center justify-center mt-5">
            <SyncLoader size={10} color="#000" />
          </div>
        )}
        {contractorChat?.data?.map((message: any) => (
          <div
            className={`w-full rounded-lg mb-2 flex items-center ${
              message?.senderType === "admins" ? "justify-end" : "justify-start"
            }`}
            key={message?._id}
          >
            {message?.senderType === "admins" ? (
              <div className="bg-black text-white font-medium text-sm w-fit rounded-tl-lg rounded-bl-lg rounded-br-lg px-5 py-2">
                <ShowMessage message={message} type={message?.messageType} />
              </div>
            ) : (
              <div className="bg-gray-300 text-black h-fit font-medium text-sm w-fit rounded-tr-lg rounded-bl-lg rounded-br-lg px-5 py-2">
                <ShowMessage message={message} type={message?.messageType} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-start gap-2 mt-4">
        {/* <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="py-3 rounded-md px-4 outline-none focus:ring-0 focus:border-black duration-200 w-full border border-gray-200"
          placeholder="Send a message..."
        /> */}
        <ChatBox message={message} setMessage={setMessage} />
        <button
          disabled={isSubmitting}
          onClick={handleMessage}
          className="py-3 rounded-md px-5 bg-black text-white"
        >
          {isSubmitting ? <ClipLoader size={20} color="#ffffff" /> : "Send"}
        </button>
      </div>
    </div>
  );
};

export default CustomerChat;
