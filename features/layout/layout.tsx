"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { redirect, useRouter } from "next/navigation";
import LoadingTemplate from "./loading";
import { getOverviewDetail } from "@/lib/api/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setOverviewDetails } from "@/lib/redux/slices/overview-data";
import { RootState } from "@/lib/redux/store";

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const details = useAppSelector(
    (state: RootState) => state.overviewTotal.details
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      // getOverviewDetail().then((response) => {
      //   if (!response) {
      //     localStorage.removeItem("token");

      //     setAuthenticated(false);
      //     router.push("/auth/login");
      //   } else {
      //     dispatch(setOverviewDetails(response));
      //     console.log(response);
      //     setAuthenticated(true);
      //   }
      // });
      // console.log(token, true);
      setAuthenticated(false);
      router.push("/auth/login");
    } else {
      // console.log(false);
      setAuthenticated(true);
      // redirect("/auth/login");
    }
  }, []);

  if (!authenticated && details.totalContractor === 0) {
    return <LoadingTemplate />;
  }

  return <LayoutElement>{children}</LayoutElement>;
};

export default Layout;

export const LayoutElement: React.FC<IProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <div className="bg-[#F0F0F0] min-w-[calc(100vw-280px)] w-[calc(100vw-21%)] max-h-screen overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};
