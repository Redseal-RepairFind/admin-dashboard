"use client";

import React from "react";
import useDisputes from "@/lib/hooks/useDisputes";

const CustomerChat = () => {
  const { conversations, singleDispute, singleConversation } = useDisputes();

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
      <div className="mt-4 border border-gray-300 h-[50vh] overflow-y-scroll"></div>
      <div className="flex items-center justify-start gap-2 mt-4">
        <input
          className="py-3 rounded-md px-4 outline-none focus:ring-0 focus:border-black duration-200 w-full border border-gray-200"
          placeholder="Send a message..."
        />
        <button className="py-3 rounded-md px-5 bg-black text-white">
          Send
        </button>
      </div>
    </div>
  );
};

export default CustomerChat;
