"use client";
import React, { useEffect, useState, useRef } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Search from "@/components/shared/search";
import { ComplaintsState, CompletedState } from "@/public/svg";
import { useSortedData } from "@/lib/hooks/useSortedData";
import { toast } from "react-hot-toast";
import Pagination from "@/components/shared/pagination";
import { useLoader } from "@/context/LoaderContext";
import Empty from "@/components/ui/empty-data";
import LoadingTemplate from "@/features/layout/loading";
import useFeedbacks from "@/lib/hooks/useFeedbacks";

const table_headings = [
  "User's name",
  "Email",
  "Application",
  "Account Type",
  "Feedback Date",
  "Response admin Name",
];
const types = [
  // { id: 1, value: "All", slug: "ALL" },
  { id: 2, value: "Open", slug: "OPEN" },
  { id: 3, value: "Ongoing", slug: "ONGOING" },
  { id: 4, value: "Closed", slug: "Closed" },
];

function FeedbacksTable({ dataToRender }: { dataToRender?: any }) {
  const {
    feedbackData,
    loadingFeedbacks,
    updateUrlParams,
    sortValue,
    handleSinglePageRoute,
  } = useFeedbacks();

  const [feedbacksData, setFeedbackData] = useState<any[]>();

  const searchParams = useSearchParams();

  const statuse = searchParams.get("feedbackStatus") || "OPEN";

  useEffect(() => {
    if (feedbackData) {
      const data = feedbackData?.data?.filter(
        (feedback: any) =>
          feedback?.status?.toLowerCase() === statuse?.toLowerCase()
      );
      setFeedbackData(data);
    }
  }, [statuse]);
  // useEffect(() => {
  //   if (sortValue.toLowerCase() === "all")
  //     setDataToRender(sortedData?.data?.data?.data);
  //   else {
  //     const data = sortedData?.data?.data?.data?.filter(
  //       (issu: any) => issu.status.toLowerCase() === sortValue.toLowerCase()
  //     );
  //     setDataToRender(data);
  //   }

  //   // console.log(dataToRender, sortedData);
  // }, [sortValue, sortedData]);

  // async function handleAcceptIssue(id: string) {
  //   toast.loading("Accepting....");
  //   try {
  //     const data = await acceptIssue(id);
  //     toast.remove();
  //     toast.success("Issue accepted by an admin");
  //     handleSinglePageRoute(id);
  //   } catch (e: any) {
  //     console.error(e);
  //     toast.remove();
  //     toast.error(e?.message);
  //   }
  // }

  // const pageProps = {
  //   data: sortedData?.data?.data,
  // };

  return (
    <TableCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-5">
          {types.map((type: any, index: number) => (
            <button
              className={
                sortValue.toLowerCase() === type?.slug.toLowerCase()
                  ? "font-semibold border-b-2 border-black"
                  : "text-gray-400"
              }
              onClick={() => {
                // sessionStorage.setItem("session_dispute_status", type.slug);
                updateUrlParams(type.slug);
              }}
              key={index}
            >
              {type.value.includes("Reviewed") ? "Ongoing" : type.value}
            </button>
          ))}
        </div>
        {/* <Search
          search={""}
          setSearch={handleQuery}
          placeholder="Search..."
          setIsQuerying={setIsQuerying}
        /> */}
      </div>

      {loadingFeedbacks ? (
        <LoadingTemplate />
      ) : (
        <TableOverflow>
          <Table>
            <Thead>
              <tr>
                {table_headings?.map((heading, index) => {
                  // Check if it's the last item and the status is "Closed" or "Ongoing"
                  if (
                    index === table_headings.length - 1 &&
                    (statuse.toLowerCase() === "closed" ||
                      statuse.toLowerCase() === "ongoing")
                  ) {
                    return <Th key={index}>{heading}</Th>;
                  }

                  // Render all other items except the last one
                  if (index !== table_headings.length - 1) {
                    return <Th key={index}>{heading}</Th>;
                  }

                  // Return null for the last item if the condition is not met
                  return null;
                })}
              </tr>
            </Thead>

            <tbody className={`relative `}>
              {feedbacksData?.map((issue: any, i: any) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 cursor-pointer hover:bg-slate-200 transition-all duration-300"
                  onClick={() => {
                    handleSinglePageRoute(issue._id);
                  }}
                >
                  <Td>
                    {issue?.user?.name
                      ? issue?.user?.name
                      : `${issue?.user?.firstName} ${issue?.user?.lastName}  `}
                  </Td>
                  <Td className="">{issue?.user?.email}</Td>
                  <Td>{issue?.userType}</Td>
                  <Td>
                    <span className="flex items-center gap-2">
                      {issue?.user?.accountType}
                    </span>
                  </Td>
                  <Td>{formatDateToDDMMYY(issue.createdAt)}</Td>
                  <Td>{issue?.response?.adminId?.name}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableOverflow>
      )}

      <div className="mt-4 w-full">{/* <Pagination {...pageProps} /> */}</div>
    </TableCard>
  );
}

export default FeedbacksTable;
