"use client";
import Image from "next/image";
import React from "react";
import logo from "@/public/logo.svg";
import {
  AccountSettings,
  Analytics,
  Contractors,
  Customers,
  Customise,
  Jobs,
  Logout,
  Overview,
  RFReps,
  Transactions,
} from "@/public/svg";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  interface INavLinks {
    name: string;
    svg: React.ReactNode;
    route: string;
  }

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const navLinks: INavLinks[] = [
    { name: "Overview", svg: <Overview />, route: "/" },
    { name: "Jobs", svg: <Jobs />, route: "/jobs" },
    { name: "Analytics", svg: <Analytics />, route: "/analytics" },
    { name: "Customers", svg: <Customers />, route: "/customers" },
    { name: "Contractors", svg: <Contractors />, route: "/contractors" },
    { name: "Sub Admins", svg: <Customers />, route: "/sub-admins" },
    { name: "Transactions", svg: <Transactions />, route: "/transactions" },
    // { name: "RF Reps", svg: <RFReps />, route: "/rf-reps" },
    { name: "Customise", svg: <Customise />, route: "/customise" },
    {
      name: "Account Settings",
      svg: <AccountSettings />,
      route: "/account-settings",
    },
  ];

  return (
    <div
      className="max-w-[280px] w-[21%] min-w-[250px] bg-white border-r-[#ddd] border-r 
            overflow-y-auto scrollbar-thin z-30 max-h-screen"
    >
      <div className="flex flex-col gap-4">
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
            pathname === link.route &&
            "border-l-[6px] border-l-[#333] bg-[#F1F1F1]"
          }`}
            href={link.route}
          >
            <span>{link.svg}</span>
            {link.name}
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
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
