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
import LoadingTemplate from "../layout/loading";
import { toast } from "react-hot-toast";
import Pagination from "@/components/shared/pagination";
import { useLoader } from "@/context/LoaderContext";
import Empty from "@/components/ui/empty-data";

const table_headings = [
  "Complainant name",
  "Defendant Name",
  "Issue date",
  "Assigned Admin",
  // "Assigned Date",
];
const types = [
  // { id: 1, value: "All", slug: "ALL" },
  { id: 2, value: "Pending", slug: "PENDING" },
  { id: 3, value: "Reviewed", slug: "REVIEWED" },
  { id: 4, value: "Resolved", slug: "RESOLVED" },
  { id: 5, value: "Rejected", slug: "REJECTED" }, // Changed id to 5
];

function IssuesTable({ dataToRender }: { dataToRender: any }) {
  const [status, setStatus] = useState("All");
  const { handleNavigation } = useLoader();

  // const [dataToRender, setDataToRender] = useState<any>([]);
  const {
    issuesData: sortedData,
    loadingIssues: loadingSortedData,
    acceptIssue,
  } = useSortedData("issues");

  // console.log(sortedData?.data?.data?.data);

  const router = useRouter();
  const pathname = usePathname();
  const param = useSearchParams();

  const initialString = param.get("issuesStatus");
  const initialSortValue =
    param.get("issuesStatus")?.replace(/_/g, " ") || "PENDING";

  // // Set the selected sort value state, initialize with the value from URL
  const [sortValue, setSortValue] = useState(initialSortValue);
  // const { adminPermissions } = useAdminPermissions();

  // const [isOpen, setIsOpen] = useState(false);

  // On page load, ensure the sort value in the state is in sync with URL
  useEffect(() => {
    const sortFromParam = param.get("issuesStatus");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue); // Update state based on URL query params
    }
  }, [param]);

  // Function to update the URL params and the state
  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase(); // Replace spaces with underscores

    // Update the URL query parameters
    if (value === "OPEN") {
      router.replace(`${pathname}`, {
        scroll: false,
      }); // Remove query params if 'All' is selected (default)
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("issuesStatus", formattedValue); // Set the selected filter in query params
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    // Set the selected value in the state
    setSortValue(value);
    setStatus(value);
  }

  function handleSinglePageRoute(id: string) {
    handleNavigation(`/issues/${id}`);
  }

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

  const pageProps = {
    data: sortedData?.data?.data,
  };

  const mainData = dataToRender?.data?.data?.data;
  // console.log(mainData);

  async function handleAcceptIssue(id: string) {
    toast.loading("Accepting....");
    try {
      const data = await acceptIssue(id);
      toast.remove();
      toast.success("Issue accepted by an admin");
    } catch (e: any) {
      console.error(e);
      toast.remove();
      toast.error(e?.message);
    }
  }

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

      {loadingSortedData ? (
        <LoadingTemplate />
      ) : (
        <TableOverflow>
          <Table>
            <Thead>
              <tr>
                {table_headings?.map((heading, index) => (
                  <Th key={index}>
                    {heading === "Assigned Admin" && sortValue === "PENDING"
                      ? "Action"
                      : heading}
                  </Th>
                ))}
              </tr>
            </Thead>
            <tbody className={`relative `}>
              {mainData?.map((issue: any, i: any) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 cursor-pointer hover:bg-slate-200 transition-all duration-300"
                  onClick={() => {
                    handleSinglePageRoute(issue._id);
                  }}
                >
                  <Td>
                    <span>
                      {issue?.reporter?.name
                        ? issue?.reporter?.name
                        : `${issue?.reporter?.firstName} ${issue?.reporter?.lastName}  `}
                    </span>
                    {"  "}
                    <span>({issue?.reporterType.replace(/s/g, "")})</span>
                  </Td>
                  <Td className="">
                    <span>
                      {issue?.reported?.name ||
                        `${issue?.reported?.firstName} ${issue?.reported?.lastName} `}
                    </span>
                    <span>
                      {" "}
                      <span> ({issue?.reportedType.replace(/s/g, "")})</span>
                    </span>
                  </Td>
                  <Td>{formatDateToDDMMYY(issue.createdAt)}</Td>
                  <Td>
                    {/* {issue?.status !== "RESOLVED" ? (
                        <>
                          <ComplaintsState />
                          <p className="text-danger capitalize">
                            {issue?.status.toLowerCase()}
                          </p>
                        </>
                      ) : (
                        <>
                          <CompletedState />
                          <p className="text-success capitalize">
                            {issue?.status.toLowerCase()}
                          </p>
                        </>
                      )} */}

                    {sortValue === "PENDING" ? (
                      <button
                        className={`px-3 py-2 rounded-md font-semibold w-40 border duration-500 transition-all border-black text-black    ${
                          issue?.status === "RESOLVED"
                            ? "bg-black hover:bg-gray-600 text-white cursor-not-allowed"
                            : "hover:bg-black hover:text-white"
                        }`}
                        disabled={issue?.status === "RESOLVED"}
                        onClick={() => {
                          issue?.status === "RESOLVED" ||
                          issue?.status === "REVIEWED"
                            ? handleSinglePageRoute(issue?._id)
                            : handleAcceptIssue(issue?._id);
                        }}
                      >
                        {issue?.status === "PENDING" ? "Accept" : "View"}
                      </button>
                    ) : (
                      <span className="flex items-center gap-2">
                        {issue?.admin?.name || "No assigned admin yet"}{" "}
                      </span>
                    )}
                  </Td>
                  {/* <Td>
                    {/* <button
                      className={`px-3 py-2 rounded-md font-semibold w-40 border duration-500 transition-all border-black text-black    ${
                        issue?.status === "RESOLVED"
                          ? "bg-black hover:bg-gray-600 text-white cursor-not-allowed"
                          : "hover:bg-black hover:text-white"
                      }`}
                      disabled={issue?.status === "RESOLVED"}
                      onClick={() => {
                        issue?.status === "RESOLVED" ||
                        issue?.status === "REVIEWED"
                          ? handleSinglePageRoute(issue?._id)
                          : handleAcceptIssue(issue?._id);
                      }}
                    >
                      {issue?.status === "PENDING" ? "Accept" : "View"}
                    </button> 

                    {formatDateToDDMMYY(issue?.assignedAt)}
                  </Td> */}
                  {/* <Td>
                <Link to={`/issues/${issue._id}`}>View Details</Link>
              </Td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </TableOverflow>
      )}

      <div className="mt-4 w-full">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
}

export default IssuesTable;
