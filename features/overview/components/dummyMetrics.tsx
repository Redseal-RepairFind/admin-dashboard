import {
  SignUpMetrics,
  QuotesGivenMetrics,
  JobsClosedMetrics,
  JobsStartedMetrics,
  AppDownloadMetrics,
  AppStorePageViewMetrics,
  AverageDisputeResolutionTimeMetrics,
  DisputesInitiatedMetrics,
  DisputesResolvedMetrics,
  JobsPostedMetrics,
  EmergencyCallMetrics,
  AccountCreationMetrics,
} from "@/public/svg";

export const dynaMetrycs = [
  {
    metricText: "signUps",
    name: "Total Signups",
    svg: <SignUpMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "accountCreations",
    name: "Accounts Created",
    svg: <AccountCreationMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "appDownloads",
    name: "Total Downloads",
    svg: <AppDownloadMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "appStorePageViews",
    name: "Total Reviews",
    svg: <AppStorePageViewMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "jobsPosted",
    name: "Total Jobs Posted",
    svg: <JobsPostedMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "quotesGiven",
    name: "Total Quotes Given",
    svg: <QuotesGivenMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "jobsStarted",
    name: "Total Jobs Started",
    svg: <JobsStartedMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "jobsClosed",
    name: "Total Jobs Closed",
    svg: <JobsClosedMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "emergencyCalls",
    name: "Total Emergency Calls",
    svg: <EmergencyCallMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "disputesInitiated",
    name: "Total Disputes Initiated",
    svg: <DisputesInitiatedMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "disputesResolved",
    name: "Total Disputes Resolved",
    svg: <DisputesResolvedMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
  {
    metricText: "averageDisputeResolutionTime",
    name: "Average Dispute Resolution",
    svg: <AverageDisputeResolutionTimeMetrics />, // Replace with appropriate SVG
    svgColor: "bg-[#AAB2D4]",
  },
];
