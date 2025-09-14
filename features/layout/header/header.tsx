"use client";
import { useEffect, useState, useContext, useRef, useMemo } from "react";
import { NotificationBell } from "@/public/svg";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  requestNotificationPermission,
  onMessageListener,
} from "@/lib/firebase/firebase";
import { UserContext } from "@/context/user-context";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import Notifications from "@/features/notifications/notifications";
import useNotifications from "@/lib/hooks/useNotifications";
import useSoundNotification from "@/lib/hooks/useSoundNotification";
import io, { Socket } from "socket.io-client";

const Header: React.FC = ({ children }: { children?: React.ReactNode }) => {
  const [image, setImage] = useState("");

  const [permission, setPermission] = useState<boolean>(true);
  const playNotification = useSoundNotification("/sounds/notification.mp3");
  const { currentUser } = useContext(UserContext);
  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef(null);
  const { data, MarkAllAsRead, refetch } = useNotifications();

  const unreadCount = useMemo(() => {
    return data?.data?.reduce((count: number, item: any) => {
      return item.readAt === null ? count + 1 : count;
    }, 0);
  }, [data]);

  const markNotifications = async () => {
    if (!unreadCount) return setOpen(true);
    toast.loading("Loading notifications");
    try {
      const data = await MarkAllAsRead();
      // console.log(data);
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

  // Request Notification Permission & Get Token
  useEffect(() => {
    requestNotificationPermission()
      .then((token: any) => {
        if (token) {
          // console.log("FCM Token received:", token);
          // TODO: Send token to your backend for push notifications
        }
      })
      .catch((error: any) => console.error("FCM Token error:", error));
  }, []);

  // Listen for incoming FCM messages
  useEffect(() => {
    const unsubscribePromise = onMessageListener().then((payload: any) => {
      // console.log("FCM Message received:", payload);
      playNotification();

      // Show a toast notification
      toast.success(payload?.notification?.title || "New Notification");

      // Optionally refetch notifications
      setTimeout(() => {
        refetch();
      }, 500);
    });

    return () => {
      unsubscribePromise.catch((error) =>
        console.error("Error unsubscribing:", error)
      );
    };
  }, [playNotification, refetch]);

  function handleNotification() {
    setPermission(true);
    const ONE_HOUR_IN_MILSEC = 60 * 60 * 1000;

    setTimeout(() => {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission !== "granted") {
            console.warn("Notification permission not granted");
            setPermission(false);
          }
        });
      }
    }, ONE_HOUR_IN_MILSEC);
  }

  return (
    <div>
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
      {!permission ? (
        <div className="bg-gray-800 mb-8 py-2 top-0 right-10 mx-10 mt-3 flex items-center z-50 text-gray-800 justify-center gap-12 shadow-2xl rounded-sm">
          <p className="text-white">
            Please enable notifications from your browser settings to receive
            Emergencies, alerts and updates.
          </p>
          <div className="flex items-center gap-4">
            <button
              className="bg-white py-2 px-4 rounded-md"
              onClick={handleNotification}
            >
              I understand
            </button>
          </div>
        </div>
      ) : null}
      <div className="flex px-[3vw] pt-8 pb-6 justify-between border-b-[#ddd] border-b items-center sticky top-[0px] gap-x-[200px] overflow-x-auto bg-[#F0F0F0] z-20">
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
              <div className="bg-red-500 w-5 h-5 rounded-full absolute top-1.5 right-1.5 text-sm text-white flex items-center justify-center">
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
            <div>
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
    </div>
  );
};

export default Header;
