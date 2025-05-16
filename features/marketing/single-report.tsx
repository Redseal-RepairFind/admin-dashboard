"use client";

import { useNotifsCampaign } from "@/lib/hooks/useNotifCampaigns";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import PageHeading from "../shared/page-body/page-heading";
import Header from "../layout/header/header";
import Wrapper from "../shared/inner-pages/wrapper";
import GoBack from "../shared/go-back-button/go-back";
import LoadingTemplate from "../layout/loading";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import Image from "next/image";

const SingleCampaignReports = () => {
  const { reports, isLoadingreports } = useNotifsCampaign();

  // console.log(reports?.data);

  const report = reports?.data?.data;
  const campaign = report?.[0]?.campaign;

  if (isLoadingreports) return <LoadingTemplate />;
  return (
    <Wrapper>
      <div className="my-8">
        <GoBack />
      </div>
      <div>
        {/* <Header /> */}

        <div className="flex justify-between items-center gap-5 mb-6">
          <PageHeading page_title={"Campaign Reports"} />
        </div>
        <BorderRectangle>
          {report?.[0] ? (
            <table className="w-full">
              <tbody>
                <SingleLineColumn name="Title" value={campaign?.title} />
                <SingleLineColumn name="Message" value={campaign?.message} />
                <SingleLineColumn name="Status" value={campaign?.status} />
                {campaign?.createdAt ? (
                  <SingleLineColumn
                    name="Date Created"
                    value={formatDateToDDMMYY(
                      campaign?.createdAt || new Date()
                    )}
                  />
                ) : null}
                <SingleLineColumn
                  name="Channels"
                  value={campaign?.channels?.join(", ")}
                />
                {campaign?.contractorSegment ? (
                  <>
                    {/* <th className="mt-6 ">
                    <span className="pt-6 text-gray-600 text-lg no-wrap">
                      Contractor Segments
                    </span>
                  </th> */}
                    {Object.entries(campaign?.contractorSegment || {}).map(
                      ([key, value]) => (
                        <SingleLineColumn
                          key={key}
                          name={key}
                          value={String(value)}
                        />
                      )
                    )}
                  </>
                ) : null}

                {report?.[0]?.contractors
                  ? Object.entries(report?.[0]?.contractors || {}).map(
                      ([key, value]) => (
                        <SingleLineColumn
                          key={key}
                          name={
                            key?.toLowerCase() === "inbox"
                              ? "Contractors Messaged"
                              : key
                          }
                          value={
                            Array.isArray(value)
                              ? `${value.length} ${
                                  key?.toLowerCase() === "inbox"
                                    ? "Contractors "
                                    : ""
                                } `
                              : typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)
                          }
                        />
                      )
                    )
                  : null}

                {campaign?.customerSegment ? (
                  <>
                    {/* <tr className="py-6 text-gray-600 text-lg">
                    Contractor Segments
                  </tr> */}
                    {Object.entries(campaign?.customerSegment || {})?.map(
                      ([key, value]) => (
                        <SingleLineColumn
                          key={key}
                          name={key}
                          value={String(value)}
                        />
                      )
                    )}
                  </>
                ) : null}

                {report?.[0]?.Customers
                  ? Object.entries(report?.[0]?.Customers || {}).map(
                      ([key, value]) => (
                        <SingleLineColumn
                          key={key}
                          name={
                            key?.toLowerCase() === "inbox"
                              ? "Customers Messaged"
                              : key
                          }
                          value={
                            Array.isArray(value)
                              ? `${value.length} ${
                                  key?.toLowerCase() === "inbox"
                                    ? "Customers "
                                    : ""
                                } `
                              : typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)
                          }
                        />
                      )
                    )
                  : null}
              </tbody>
            </table>
          ) : (
            <div className="w-full justify-center items-center flex flex-col -gap-4 min-h-[60vh]">
              <h1>Current Campaign does not have a report yet</h1>

              <Image
                src="/report.png"
                alt="Report Image"
                height={400}
                width={200}
              />
            </div>
          )}
        </BorderRectangle>
      </div>
    </Wrapper>
  );
};

export default SingleCampaignReports;
