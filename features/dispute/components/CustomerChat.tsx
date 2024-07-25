"use client";

import React, { useState } from "react";
import useDisputes from "@/lib/hooks/useDisputes";
import { useQuery } from "react-query";
import { dispute } from "@/lib/api/dispute";
import toast from "react-hot-toast";

const CustomerChat = () => {
  const { conversations, singleDispute, SendMessage } = useDisputes();

  const [message, setMessage] = useState<string>("");

  const id =
    singleDispute?.data?.conversations?.arbitratorCustomerConversation?.id;

  const {
    data: customerChat,
    // isLoading: loadingDisputes,
    refetch,
  } = useQuery(
    ["Customer Arbitrator Conversation"],
    () => dispute.getConversationMessages(id),
    {
      cacheTime: 100,
      staleTime: 100,
      refetchOnWindowFocus: true,
      refetchInterval: 3000,
      enabled: Boolean(singleDispute),
      select: (data) => data?.data,
    }
  );

  const handleMessage = async () => {
    const payload = { type: "TEXT", message };

    if (!message) return toast.error("Kindly type in a message...");

    toast.loading("Processing...");
    try {
      const response = await SendMessage({ id, payload });
      toast.remove();
      toast.success(response?.message);
      setMessage("");
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (e: any) {
      toast.remove();
      //   console.log({ e });
      toast.error(e?.response?.data?.message);
    }
  };

  return (
    <div className="md:w-[700px] mx-2 w-full mt-10">
      <div className="bg-gray-100 flex items-center justify-start gap-4 rounded-md py-5 px-3">
        <h1 className="font-medium">Customer Chat between</h1>
        <div className="bg-white p-3 rounded-md flex items-center justify-between">
          <div className="px-5">
            <p className="font-semibold">
              {singleDispute?.data?.customer?.firstName}{" "}
              {singleDispute?.data?.customer?.lastName}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 p-5 border border-gray-300 h-[50vh] overflow-y-scroll">
        {customerChat?.data?.map((message: any) => (
          <div
            className={`w-full rounded-lg mb-2 flex items-center ${
              message?.senderType === "admins" ? "justify-start" : "justify-end"
            }`}
            key={message?._id}
          >
            {message?.senderType === "admins" ? (
              <div className="bg-black text-white font-medium text-sm relative w-fit rounded-md px-5 py-2">
                {message?.message}
                <span className="bg-black w-2 h-2 absolute top-[-.5px] left-[-.5px]"></span>
              </div>
            ) : (
              <div className="bg-gray-300 text-black font-medium text-sm relative w-fit rounded-md px-5 py-2">
                {message?.message}
                <span className="bg-gray-300 w-2 h-2 absolute top-[-.5px] right-[-.3px]"></span>
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
          onClick={handleMessage}
          className="py-3 rounded-md px-5 bg-black text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerChat;
