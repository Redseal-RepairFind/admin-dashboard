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
  // { name: "Analytics", svg: <Analytics />, route: "/analytics" },
  {
    name: "Customers",
    svg: <Customers />,
    route: "/customers",
    readPermissions: ["view_customers", "read_customers", "crud_customers"],
  },
  {
    name: "Contractors",
    svg: <Contractors />,
    route: "/contractors",
    readPermissions: ["read_contractor", "crud_contractor"],
  },
  {
    name: "Jobs",
    svg: <JobIcon />,
    route: "/jobs",
    readPermissions: ["read_job", "crud_job"],
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
    readPermissions: ["read_transaction", "crud_transaction"],
  },

  {
    name: "Emergency",
    svg: <MdEmergency />,
    route: "/emergency",
    readPermissions: ["read_emergency", "crud_emergency"],
  },
  {
    name: "Dispute",
    svg: <Transactions />,
    route: "/dispute",
    readPermissions: ["read_dispute", "crud_dispute"],
  },
  { name: "Issues", svg: <Issues />, route: "/issues", readPermissions: [] },

  {
    name: "App versions",
    svg: <AppVersion />,
    route: "/App_version",
    readPermissions: [],
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
    readPermissions: [],
  },
  {
    name: "Promotion",
    svg: <AccountSettings />,
    route: "/promotion",
    readPermissions: [],
  },

  // {
  //   name: "Account Settings",
  //   svg: <AccountSettings />,
  //   route: "/account-settings",
  // },
];
