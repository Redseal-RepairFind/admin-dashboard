"use client";

import React, { useState, useEffect } from "react";
import useDisputes from "@/lib/hooks/useDisputes";
import { useQuery } from "react-query";
import { dispute } from "@/lib/api/dispute";
import toast from "react-hot-toast";
import { ClipLoader, SyncLoader } from "react-spinners";
import io, { Socket } from "socket.io-client";

const CustomerChat = () => {
  const { conversations, singleDispute, SendMessage } = useDisputes();

  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const id =
    singleDispute?.data?.conversations?.arbitratorContractorConversation?.id;

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

  const handleMessage = async () => {
    const payload = { type: "TEXT", message };

    if (!message) return toast.error("Kindly type in a message...");

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

      socket.on("connect", () => {
        console.log("connected to server");
      });

      socket.on("NEW_UNREAD_MESSAGE", (data: any) => {
        // console.log("Received conversation event:", data);
        setTimeout(() => {
          refetch();
        }, 800);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      socket.on("error", (error: any) => {
        console.error("Socket.IO error:", error);
      });
    }

    return () => {
      if (socket) {
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
        {isLoading && (
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
                {message?.message}
              </div>
            ) : (
              <div className="bg-gray-300 text-black font-medium text-sm w-fit rounded-tr-lg rounded-bl-lg rounded-br-lg px-5 py-2">
                {message?.message}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-start gap-2 mt-4">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="py-3 rounded-md px-4 outline-none focus:ring-0 focus:border-black duration-200 w-full border border-gray-200"
          placeholder="Send a message..."
        />
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
