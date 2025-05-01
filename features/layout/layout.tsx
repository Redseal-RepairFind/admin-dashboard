"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { redirect, useRouter } from "next/navigation";
import LoadingTemplate from "./loading";

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const [isLoadingAdmin, setisLoadingAdmin] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      router.push("/login");
    }

    setisLoadingAdmin(false);
  }, []);

  if (isLoadingAdmin) {
    return <LoadingTemplate />;
  }

  return <LayoutElement>{children}</LayoutElement>;
};

export default Layout;

export const LayoutElement: React.FC<IProps> = ({ children }) => {
  const [expandBar, setExpandBar] = useState(true);
  return (
    <div className="flex min-h-screen relative">
      <Sidebar expandBar={expandBar} setExpandBar={setExpandBar} />
      <div
        className={`bg-[#F0F0F0] ${
          expandBar
            ? "min-w-[calc(100vw-280px)]  w-[calc(100vw-21%)]"
            : "w-[calc(100vw-10%)]"
        } max-h-screen overflow-y-scroll`}
      >
        {children}
      </div>
    </div>
  );
};
