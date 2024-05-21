"use client";
import { NotificationBell } from "@/public/svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getTotalUnseenNotification } from "@/lib/api/api";

interface IProps {
  children?: React.ReactNode;
}

const Header: React.FC<IProps> = ({ children }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState("");
  const [totalUnseenNotification, setTotalUnseenNotification] = useState(0);

  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");
    const storedImage = localStorage.getItem("image");
    const storedIsSuperAdmin = localStorage.getItem("isSuperAdmin");

    setFirstName(storedFirstName || "");
    setLastName(storedLastName || "");
    setImage(storedImage || "");
    setIsSuperAdmin(storedIsSuperAdmin || "");
  }, []);

  useEffect(() => {
    getTotalUnseenNotification().then((res) => {
      if (res?.success) {
        setTotalUnseenNotification(res.data.totalUnseenNotification);
      }
    });
  }, []);
  return (
    <div
      className="flex px-[3vw] pt-8 pb-6 justify-between border-b-[#ddd] border-b 
    items-center sticky top-[0px] gap-x-[200px] overflow-x-auto bg-[#F0F0F0] z-20"
    >
      {/* Name */}
      <p className="text-xl font-[500] whitespace-nowrap">
        Welcome, <span className="font-[600]">{firstName || ""}</span>
      </p>

      <div className="flex items-center gap-7">
        {children}
        {/* Notification Bell */}
        <Link
          href={"/notifications"}
          className="bg-white flex justify-center items-center w-14 h-12 rounded relative"
        >
          <NotificationBell />
          {totalUnseenNotification > 0 && (
            <div
              className="bg-[#ccc] w-5 h-5 rounded-full absolute top-1.5
          right-1.5 text-sm text-white flex items-center justify-center"
            >
              {totalUnseenNotification}
            </div>
          )}
        </Link>
        {/* Admin Profile */}
        <div className="flex gap-3">
          {image && image !== "" && (
            <Image
              src={image}
              width={32}
              height={32}
              alt="admin picture"
              className="rounded-[50%] object-cover w-10 h-10"
            />
          )}
          {(!image || image === "") && (
            <div className="w-10 h-10 rounded-[50%] bg-[#444]/40 flex items-center justify-center">
              <p className="text font-[600] text-white">
                <span className="capitalize">{firstName?.slice(0, 1)}</span>
                <span className="capitalize">{lastName?.slice(0, 1)}</span>
              </p>
            </div>
          )}
          <div className="">
            <p className="font-[500]">{`${firstName} ${lastName}`}</p>
            <p className="font-[400] ml-1">
              {isSuperAdmin === "true" ? "Super Admin" : "Admin"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
