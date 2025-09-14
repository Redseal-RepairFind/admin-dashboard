"use client";

import { AppVersion } from "@/public/svg";
import Header from "../layout/header/header";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import VersionTable from "./VersionTable";
import AnalyticCard from "../jobs/components/analytic-card";
import useAppVersion from "./hooks/useAppVersion";

function Index() {
  const { totalVersions } = useAppVersion();

  return (
    <>
      <Header />
      <PageBody>
        <div className="flex justify-between mb-6 items-center">
          <PageHeading page_title="App Versions" />
          {/* <Filter /> */}
        </div>

        <div className="overflow-x-auto mb-6">
          <div className="flex gap-8 min-w-[1200px]">
            <AnalyticCard
              icon={<AppVersion bg="#ac9191" />}
              iconColor="bg-[#ac9191]"
              borderColor="border-l-[#2e0505]"
              name="Total App Versions Released"
              info={totalVersions}
              tip="Total App Versions that has been released"
            />
          </div>
        </div>
        <VersionTable />
      </PageBody>
    </>
  );
}

export default Index;
