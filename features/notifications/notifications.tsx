"use client";

import React, { useState } from "react";
import useNotifications from "@/lib/hooks/useNotifications";
import ViewNotifications from "./components/view-notifications";
import Notification from "./components/notification";
import Pagination from "@/components/shared/pagination";

const Notifications = () => {
  const { data, perPage, setPerPage, currentPage, setCurrentPage } =
    useNotifications();

  const [currentTab, setCurrentTab] = useState<"notifications" | "alerts">(
    "notifications"
  );

  // console.log(data);

  const pageProps = {
    data,
    perPage,
    setPerPage,
    pageNo: currentPage,
    setPageNo: setCurrentPage,
  };

  return (
    <div className="mt-[30px] rounded-md w-[700px]">
      {/* <div className="border w-fit mx-auto border-gray-100 rounded-md flex items-center justify-center bg-gray-100 gap-1 p-2">
        <button
          className={`w-[130px] border border-gray-100 rounded-md py-2 ${
            currentTab === "notifications" ? "bg-white shadow" : "bg-gray-100"
          }`}
        >
          Notifications
        </button> */}
      {/* <button
          className={`w-[130px] border border-gray-100 rounded-md py-2 ${
            currentTab === "alerts" ? "bg-white shadow" : "bg-gray-100"
          }`}
        >
          Alerts
        </button> */}
      {/* </div> */}
      <div className="flex items-center justify-center">
        <h1 className="font-medium text-2xl underline">Notifications</h1>
      </div>
      <div className="my-2 max-h-[500px] border border-[#e6e4e4] shadow-inner p-4 overflow-y-scroll">
        {data?.data?.map((item: any, index: number) => (
          <Notification key={index} data={item} />
        ))}
        <div className="w-full mt-4">
          <Pagination {...pageProps} />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
