"use client";

import React, { useState, useRef, useEffect } from "react";
import useDisputes from "@/lib/hooks/useDisputes";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CustomerChat from "./CustomerChat";
import ContractorChat from "./ContractorChat";
import { SyncLoader } from "react-spinners";
import io, { Socket } from "socket.io-client";

const Chat = () => {
  const { singleDispute, messages, loadingMessages, refetchMessages } =
    useDisputes();

  const [openCustomer, setOpenCustomer] = useState<boolean>(false);
  const customerModalRef = useRef(null);
  const [openContractor, setOpenContractor] = useState<boolean>(false);
  const contractorModalRef = useRef(null);

  // console.log(messages);

  const token = sessionStorage.getItem("userToken");

  const url = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    let socket: Socket;

    if (token) {
      socket = io(`${url}`, {
        extraHeaders: {
          token,
        },
      });

      socket.on("connect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      socket.on("Conversation", (data) => {
        console.log("Received stripe_identity event:", data);
        setTimeout(() => {
          refetchMessages();
        }, 800);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      socket.on("error", (error) => {
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
    <>
      <Modal
        open={openCustomer}
        onClose={() => setOpenCustomer(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={customerModalRef.current}
      >
        <CustomerChat />
      </Modal>
      <Modal
        open={openContractor}
        onClose={() => setOpenContractor(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={contractorModalRef.current}
      >
        <ContractorChat />
      </Modal>

      <div className="rounded-lg bg-white p-5">
        <div className="bg-gray-100 flex items-center justify-start gap-4 rounded-md py-5 px-3">
          <h1 className="font-medium">Chat between</h1>
          <div className="bg-white p-3 rounded-md flex items-center justify-between">
            <div className="border-r border-gray-200 px-5">
              <p className="font-semibold mt-2">
                {singleDispute?.data?.customer?.firstName}{" "}
                {singleDispute?.data?.customer?.lastName}
              </p>
              <p className="text-gray-400">Customer</p>
            </div>
            <div className="px-5">
              <p className="font-semibold mt-2">
                {singleDispute?.data?.contractor?.firstName}{" "}
                {singleDispute?.data?.contractor?.lastName}
              </p>
              <p className="text-gray-400">Contractor</p>
            </div>
          </div>
        </div>
        <div className="mt-4 border border-gray-300 h-[50vh] p-4 overflow-y-scroll">
          {loadingMessages && (
            <div className="w-full flex items-center justify-center mt-10">
              <SyncLoader size={10} color="#000" />
            </div>
          )}
          {messages?.data?.map((message: any) => (
            <div
              className={`w-full rounded-lg mb-2 flex items-center ${
                message?.senderType !== "contractors"
                  ? "justify-start"
                  : "justify-end"
              }`}
              key={message?._id}
            >
              {message?.senderType !== "contractors" ? (
                <div className="bg-gray-300 text-black font-medium text-sm w-fit rounded-tr-lg rounded-bl-lg rounded-br-lg px-5 py-2">
                  {message?.message}
                </div>
              ) : (
                <div className="bg-black text-white font-medium text-sm w-fit rounded-tl-lg rounded-bl-lg rounded-br-lg px-5 py-2">
                  {message?.message}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-start gap-5 mt-4">
          <button
            onClick={() => setOpenContractor(true)}
            className="py-3 px-5 border hover:bg-black hover:text-white duration-300 border-black rounded-md"
          >
            Chat with Contractor
          </button>
          <button
            onClick={() => setOpenCustomer(true)}
            className="py-3 px-5 border hover:bg-black hover:text-white duration-300 border-black rounded-md"
          >
            Chat with Customer
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
