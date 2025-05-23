"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/public/logo.svg";
import Cookies from "js-cookie";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import useAdminPermissions from "@/lib/hooks/useAdminPermissions";
import { navLinks } from "@/lib/utils/utils";
import { Logout, SideBarIcon } from "@/public/svg";
import { useLoader } from "@/context/LoaderContext";
import LoadingPage from "@/app/loading";
import { fetchPermissionsFromAPI } from "@/lib/api/fetchPermissions";

const Sidebar = ({
  expandBar,
  setExpandBar,
}: {
  expandBar: boolean;
  setExpandBar: any;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // const { adminPermissions } = useAdminPermissions();
  const { setLoading } = useLoader();

  const logOut = () => {
    router.push("/login");
    sessionStorage.clear();
    Cookies.remove("reparfind_token");
    Cookies.remove("user");
  };

  // const filteredNavLinks = navLinks?.filter((link) => {
  //   // Include routes with no readPermissions or matching permissions
  //   return (
  //     link?.readPermissions.length === 0 ||
  //     link?.readPermissions.some((permission) =>
  //       adminPermissions?.data?.includes(permission)
  //     )
  //   );
  // });

  return (
    <div
      className={`${
        expandBar
          ? "max-w-[280px] w-[21%] min-w-[250px]"
          : "w-[10%] min-w-[120px]"
      } bg-white overflow-y-auto scrollbar-thin z-30 max-h-screen`}
    >
      <div className="flex flex-col gap-4">
        <div className="w-full px-4">
          <button
            className="shadow-lg p-2"
            onClick={() => setExpandBar((bar: boolean) => !bar)}
          >
            <SideBarIcon />
          </button>
        </div>
        {/* Logo Container */}
        <div className="flex flex-col items-center py-10">
          <Image src={logo} alt="Logo" width={32} height={32} />
          <p className="text-sm">RepairFind</p>
        </div>

        {/* Navigation */}
        {navLinks.map((link, index) => (
          <Link
            key={index}
            className={`flex gap-2 text-sm items-center pl-14 py-3 transition-all duration-500 
          border-transparent outline-none hover:border-l-[4px] hover:border-l-[#333]/50 
          hover:bg-[#F1F1F1]/60 ${
            pathname.includes(link.route) &&
            "border-l-[6px] border-l-[#333] bg-[#F1F1F1]"
          }`}
            href={link.route}
            onClick={() => setLoading(true)}
          >
            <span>{link.svg}</span>
            {expandBar ? link.name : ""}
          </Link>
        ))}

        <div className="my-24">
          <button
            className={`flex gap-2 text-sm items-center pl-14 py-3 transition-all duration-500 
          border-transparent outline-none hover:border-l-[4px] hover:border-l-[#333]/50 w-full
          hover:bg-[#F1F1F1]/60`}
            onClick={logOut}
          >
            <span>
              <Logout />
            </span>
            {expandBar ? "Logout" : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
