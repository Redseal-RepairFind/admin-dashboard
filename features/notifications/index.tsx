"use client";
import React, { useEffect, useState } from "react";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import LoadingTemplate from "../layout/loading";
import NotificationBox from "./components/box";
import warning from "@/public/warning.svg";
import money from "@/public/money.svg";
import verified from "@/public/round-verified.svg";
import { getAllNotifications, viewNotification } from "@/lib/api/api";
import { INotifications } from "@/lib/types";
import Paginator from "../shared/table/components/paginator";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";

const choseSvg = (title: string) => {
  return title.toLowerCase().includes("payment")
    ? money
    : title.toLowerCase().includes("booked") ||
      title.toLowerCase().includes("completed")
    ? verified
    : title.toLowerCase().includes("complain")
    ? warning
    : verified;
};

function Notification() {
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [notifications, setNotifications] = useState<INotifications[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getAllNotifications({ page: currentPage, limit: 10 }).then((res) => {
      if (res) {
        setLoading(false);
        setTotalNotifications(res.totalNotification);
        setNotifications(res.notifications);
        viewNotification();
      }
    });
  }, [currentPage]);

  return (
    <div className="mb-8">
      <Header />
      {loading && <LoadingTemplate />}
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="Notifications" />
          {/* <p className="text-center text-sm font-semibold underline">
            Mark all as read
          </p> */}
        </div>
        <div className="mb-8">
          {notifications?.map((item) => (
            <NotificationBox
              key={item._id}
              imgSrc={choseSvg(item.title)}
              title={item.title}
              date={formatDateToDDMMYY(item.createdAt)}
              info={item.message}
            />
          ))}
        </div>

        <Paginator
          max={totalNotifications}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </PageBody>
    </div>
  );
}

export default Notification;
