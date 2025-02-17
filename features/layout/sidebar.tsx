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
  Gst,
  JobIcon,
  TotalJobs,
  TotalRevenue,
  AppVersion,
  Issues,
} from "@/public/svg";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MdEmergency } from "react-icons/md";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  interface INavLinks {
    name: string;
    svg: React.ReactNode;
    route: string;
  }

  const logOut = () => {
    router.push("/auth/login");
    sessionStorage.clear();
  };

  const navLinks: INavLinks[] = [
    { name: "Overview", svg: <Overview />, route: "/overview" },
    // { name: "Jobs", svg: <Jobs />, route: "/jobs" },
    { name: "Employees", svg: <RFReps />, route: "/staff" },
    // { name: "Analytics", svg: <Analytics />, route: "/analytics" },
    { name: "Customers", svg: <Customers />, route: "/customers" },
    { name: "Contractors", svg: <Contractors />, route: "/contractors" },
    { name: "Jobs", svg: <JobIcon />, route: "/jobs" },
    { name: "Booking Analysis", svg: <TotalJobs />, route: "/job_days" },

    { name: "Transactions", svg: <TotalRevenue />, route: "/transactions" },

    { name: "Emergency", svg: <MdEmergency />, route: "/emergency" },
    { name: "Dispute", svg: <Transactions />, route: "/dispute" },
    { name: "Issues", svg: <Issues />, route: "/issues" },

    { name: "App versions", svg: <AppVersion />, route: "/App_version" },
    // { name: "Transactions", svg: <Transactions />, route: "/transactions" },
    { name: "Gst Validation", svg: <Gst />, route: "/gst" },
    { name: "Customise", svg: <Customise />, route: "/customise" },
    { name: "Promotion", svg: <AccountSettings />, route: "/promotion" },

    // {
    //   name: "Account Settings",
    //   svg: <AccountSettings />,
    //   route: "/account-settings",
    // },
  ];

  // ;

  return (
    <div className="max-w-[280px] w-[21%] min-w-[250px] bg-white overflow-y-auto scrollbar-thin z-30 max-h-screen">
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
            pathname.includes(link.route) &&
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
