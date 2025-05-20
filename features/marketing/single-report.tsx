"use client";

import { useNotifsCampaign } from "@/lib/hooks/useNotifCampaigns";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import PageHeading from "../shared/page-body/page-heading";
import GoBack from "../shared/go-back-button/go-back";
import LoadingTemplate from "../layout/loading";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import Wrapper from "../shared/inner-pages/wrapper";
import Image from "next/image";

const SingleCampaignReports = () => {
  const { reports, isLoadingreports } = useNotifsCampaign();
  // console.log(reports);
  const report = reports?.data?.data;

  if (isLoadingreports) return <LoadingTemplate />;

  return (
    <Wrapper>
      <div className="my-8">
        <GoBack />
      </div>

      <div className="flex justify-between items-center gap-5 mb-6">
        <PageHeading page_title={"Campaign Reports"} />
      </div>

      {report?.length ? (
        report.map((rpt: any, idx: number) => {
          const campaign = rpt?.campaign;

          const staticFields = [
            { name: "Title", value: campaign?.title },
            { name: "Message", value: campaign?.message },
            { name: "Status", value: campaign?.status },
            campaign?.createdAt && {
              name: "Date Created",
              value: formatDateToDDMMYY(campaign?.createdAt),
            },
            {
              name: "Channels",
              value: campaign?.channels?.join(", "),
            },
          ].filter(Boolean);
          const contractorSegment = Object.entries(
            campaign?.contractorSegment || {}
          ).map(([key, value]) => ({
            name: key,
            value: String(value),
          }));

          const customerSegment = Object.entries(
            campaign?.customerSegment || {}
          ).map(([key, value]) => ({
            name: key,
            value: String(value),
          }));

          const contractors = Object.entries(rpt?.contractors || {}).map(
            ([key, value]) => ({
              name:
                key?.toLowerCase() === "inbox" ? "Contractors Messaged" : key,
              value: Array.isArray(value)
                ? `${value.length} ${
                    key.toLowerCase() === "inbox" ? "Contractors " : ""
                  }`
                : typeof value === "object"
                ? JSON.stringify(value)
                : String(value),
            })
          );

          const customers = Object.entries(rpt?.Customers || {}).map(
            ([key, value]) => ({
              name: key?.toLowerCase() === "inbox" ? "Customers Messaged" : key,
              value: Array.isArray(value)
                ? `${value.length} ${
                    key.toLowerCase() === "inbox" ? "Customers " : ""
                  }`
                : typeof value === "object"
                ? JSON.stringify(value)
                : String(value),
            })
          );

          const allRows = [
            ...staticFields,
            ...contractorSegment,
            ...contractors,
            ...customerSegment,
            ...customers,
          ];

          return (
            <div key={idx} className="mb-8">
              <BorderRectangle>
                <table className="w-full">
                  <tbody>
                    {allRows.map(({ name, value }) => (
                      <SingleLineColumn key={name} name={name} value={value} />
                    ))}
                  </tbody>
                </table>
              </BorderRectangle>
            </div>
          );
        })
      ) : (
        <div className="w-full justify-center items-center flex flex-col gap-4 min-h-[60vh]">
          <h1>Current Campaign does not have a report yet</h1>
          <Image
            src="/report.png"
            alt="Report Image"
            height={400}
            width={200}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default SingleCampaignReports;
