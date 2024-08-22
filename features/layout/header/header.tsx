"use client";
import { NotificationBell } from "@/public/svg";
import Image from "next/image";
import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import Link from "next/link";
import { getTotalUnseenNotification } from "@/lib/api/api";
import { UserContext } from "@/context/user-context";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Notifications from "@/features/notifications/notifications";
import useNotifications from "@/lib/hooks/useNotifications";
import toast from "react-hot-toast";
import io, { Socket } from "socket.io-client";

interface IProps {
  children?: React.ReactNode;
}

const Header: React.FC<IProps> = ({ children }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState("");
  const [totalUnseenNotification, setTotalUnseenNotification] = useState(2);

  const { currentUser } = useContext(UserContext);

  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef(null);

  const { data, MarkAllAsRead, refetch } = useNotifications();

  const unreadCount = useMemo(() => {
    return data?.data?.reduce((count: number, item: any) => {
      return item.readAt === null ? count + 1 : count;
    }, 0);
  }, [data]);

  // console.log(unreadCount);

  const markNotifications = async () => {
    if (!unreadCount) return setOpen(true);
    toast.loading("Loading notifications");
    try {
      const data = await MarkAllAsRead();
      console.log(data);
      toast.remove();
      toast.success("Loaded successfully...");
      setTimeout(() => {
        refetch();
        setOpen(true);
      }, 1000);
    } catch (e: any) {
      toast.remove();
      toast.error(e?.response?.data?.message);
    }
  };

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("userToken") : "";

  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    let socket: Socket;

    if (token) {
      socket = io(`${url}`, {
        extraHeaders: {
          token,
        },

        // transports: ["websocket"],
      });

      console.log("Before connection");

      socket.on("connect", () => {
        console.log("connected from Socket.IO server");
      });

      socket.on("NEW_NOTIFICATION", (data: any) => {
        console.log("Received notification event:", data);
        setTimeout(() => {
          refetch();
        }, 500);
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
        <Notifications />
      </Modal>
      <div
        className="flex px-[3vw] pt-8 pb-6 justify-between border-b-[#ddd] border-b 
    items-center sticky top-[0px] gap-x-[200px] overflow-x-auto bg-[#F0F0F0] z-20"
      >
        {/* Name */}
        <p className="text-xl font-[500] whitespace-nowrap">
          Welcome,{" "}
          <span className="font-[600]">{currentUser?.firstName || ""}</span>
        </p>

        <div className="flex items-center gap-7">
          {children}
          {/* Notification Bell */}
          <button
            onClick={markNotifications}
            className="bg-white flex justify-center items-center w-14 h-12 rounded relative"
          >
            <NotificationBell />
            {unreadCount > 0 && (
              <div
                className="bg-red-500 w-5 h-5 rounded-full absolute top-1.5
          right-1.5 text-sm text-white flex items-center justify-center"
              >
                {unreadCount}
              </div>
            )}
          </button>
          {/* Admin Profile */}
          <div className="flex gap-3">
            {image && image !== "" && (
              <Image
                src={currentUser?.profilePhoto?.url}
                width={32}
                height={32}
                alt="admin picture"
                className="rounded-[50%] object-cover w-10 h-10"
              />
            )}
            {(!image || image === "") && (
              <div className="w-10 h-10 rounded-[50%] bg-[#444]/40 flex items-center justify-center">
                <p className="text font-[600] text-white">
                  <span className="capitalize">
                    {currentUser?.firstName?.slice(0, 1)}
                  </span>
                  <span className="capitalize">
                    {currentUser?.lastName?.slice(0, 1)}
                  </span>
                </p>
              </div>
            )}
            <div className="">
              <p className="font-[500]">
                {currentUser?.firstName
                  ? `${currentUser?.firstName} ${currentUser?.lastName}`
                  : ""}
              </p>
              <p className="font-[400] ml-1">
                {currentUser?.superAdmin ? "Super Admin" : "Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
