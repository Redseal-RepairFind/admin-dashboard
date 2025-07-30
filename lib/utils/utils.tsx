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
  FeedBackIcon,
} from "@/public/svg";

import { MdEmergency } from "react-icons/md";

interface INavLinks {
  name: string;
  svg: React.ReactNode;
  route: string;
  readPermissions: string[];
}
export const navLinks: INavLinks[] = [
  {
    name: "Overview",
    svg: <Overview />,
    route: "/overview",
    readPermissions: [],
  },
  // { name: "Jobs", svg: <Jobs />, route: "/jobs" },
  {
    name: "Employees",
    svg: <RFReps />,
    route: "/staff",
    readPermissions: [],
  },
  {
    name: "File Moderations ",
    svg: <Jobs />,
    route: "/file_moderations",
    readPermissions: ["manage_staffs"],
  },
  // { name: "Analytics", svg: <Analytics />, route: "/analytics" },

  {
    name: "Customers",
    svg: <Customers />,
    route: "/customers",
    readPermissions: ["manage_customers"],
  },
  {
    name: "Contractors",
    svg: <Contractors />,
    route: "/contractors",
    readPermissions: ["manage_contractors", "delete_contractors"],
  },
  {
    name: "Jobs",
    svg: <JobIcon />,
    route: "/jobs",
    readPermissions: [],
  },
  {
    name: "Web Jobs",
    svg: <JobIcon />,
    route: "/webjobs",
    readPermissions: [],
  },
  {
    name: "Booking Analysis",
    svg: <TotalJobs />,
    route: "/job_days",
    readPermissions: [],
  },

  {
    name: "Transactions",
    svg: <TotalRevenue />,
    route: "/transactions",
    readPermissions: [],
  },
  {
    name: "Feed Backs",
    svg: <FeedBackIcon />,
    route: "/feedbacks",
    readPermissions: ["manage_staffs"],
  },
  {
    name: "Marketing",
    svg: <TotalJobs />,
    route: "/marketing",
    readPermissions: [""],
  },

  {
    name: "Emergency",
    svg: <MdEmergency />,
    route: "/emergency",
    readPermissions: ["manage_emergencies"],
  },
  {
    name: "Dispute",
    svg: <Transactions />,
    route: "/dispute",
    readPermissions: ["manage_disputes"],
  },
  {
    name: "Issues",
    svg: <Issues />,
    route: "/issues",
    readPermissions: ["manage_issues"],
  },

  {
    name: "App versions",
    svg: <AppVersion />,
    route: "/App_version",
    readPermissions: ["manage_app_versions"],
  },

  // { name: "Transactions", svg: <Transactions />, route: "/transactions" },
  {
    name: "Gst Validation",
    svg: <Gst />,
    route: "/gst",
    readPermissions: [],
  },
  {
    name: "Customise",
    svg: <Customise />,
    route: "/customise",
    readPermissions: ["manage_quizzes", "manage_questions"],
  },
  {
    name: "Promotion",
    svg: <AccountSettings />,
    route: "/promotion",
    readPermissions: ["manage_promotions"],
  },

  // {
  //   name: "Account Settings",
  //   svg: <AccountSettings />,
  //   route: "/account-settings",
  // },
];
