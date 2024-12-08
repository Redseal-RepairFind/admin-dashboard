"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ComplaintsState, CompletedState } from "@/public/svg";
import Card from "./Card";
import image from "@/public/admin-pic.png";
import Heading from "../shared/table/components/table-heading";
import { Modal } from "react-responsive-modal";
import { customers } from "@/lib/api/customers";
import { formatDate } from "@/lib/utils/format-date";
import { useRouter } from "next/navigation";
import LoadingTemplate from "../layout/loading";
import JobHistory from "./JobHistory";
import IssueCard from "./Issue-card";
import SanctionCard from "./Sanction-Card";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { useSortedData } from "@/lib/hooks/useSortedData";

function SingleIssue({ id }: { id?: string }) {
  const router = useRouter();

  const { strikeUser, refetchIssues } = useSortedData("");

  // States for issue data and loading state
  const [issue, setIssue] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState({
    issueCard: false,
    sanctionCard: false,
  });
  const [issueData, setIssueData] = useState({
    // userId: "",
    reason: "",
    level: 0,
  });

  // Fetch issue data
  useEffect(() => {
    if (!id) return;

    const getIssue = async () => {
      setIsLoading(true);
      try {
        const issue = await customers.getSingleIssue(id);
        setIssue(issue?.data?.data || null);
      } catch (error) {
        console.error("Error fetching issue:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getIssue();
  }, [id]);

  // Handle modal state
  const handleModalClose = (card: "issue" | "sanction") => {
    card === "issue"
      ? setOpenModal((iss) => ({ ...iss, issueCard: false }))
      : setOpenModal((iss) => ({ ...iss, sanctionCard: false }));
  };
  const handleModalOpen = (card: "issue" | "sanction") => {
    card === "issue"
      ? setOpenModal({ issueCard: true, sanctionCard: false })
      : setOpenModal({ issueCard: false, sanctionCard: true });
  };

  // Handle navigation
  const handleBack = () => {
    router.back();
    sessionStorage.removeItem("chatId");
  };
  const handleGotoChat = () => {
    router.push(`/issues/${id}/chat/${issue?.conversation?.id}`);
    sessionStorage.setItem("chatId", issue?.conversation?.id);
  };

  async function handleStrikeUser(id: any) {
    toast.loading(
      `Issuing ${
        reportedType.includes("customer") ? "Customer" : "Contractor"
      } a strike...`
    );
    try {
      const payload = { ...issueData, userId: reported.id };
      const data = await strikeUser({ payload, id: issue.id });
      refetchIssues();
      // console.log(data);

      toast.remove();
      toast.success(
        `Strike successfully Issued to  ${
          reportedType.includes("customer") ? "Customer" : "Contractor"
        }`
      );
      handleModalClose("sanction");
    } catch (error: any) {
      toast.remove();
      toast.error(error?.message);
    }
  }

  // Loading state rendering
  if (isLoading) {
    return <LoadingTemplate />;
  }

  // Fallback for missing issue data
  if (!issue) {
    return (
      <div className="px-8 py-5">
        <p>No issue data available.</p>
      </div>
    );
  }

  // console.log(issue);

  const {
    reporter,
    reporterType,
    reported,
    reportedType,
    sanctions,
    assignedAt,
    createdAt,
    comment,
    status,
  } = issue;

  // console.log(issue);

  return (
    <div className="px-8 py-5">
      <div className="bg-white rounded-lg py-4 w-full px-5 mt-4 mb-8 font-semibold text-lg">
        Issue
      </div>

      <Modal
        open={openModal.issueCard}
        onClose={() => handleModalClose("issue")}
        classNames={{
          modal: "customModal",
        }}
      >
        <IssueCard
          title="Sanction"
          offender={
            reportedType.includes("customer") ? "Customer" : "Contractor"
          }
          setIssueData={setIssueData}
          handleOpenSanction={() => handleModalOpen("sanction")}
        />
      </Modal>

      <Modal
        open={openModal.sanctionCard}
        onClose={() => handleModalClose("sanction")}
        classNames={{
          modal: "customModal",
        }}
      >
        <SanctionCard
          data={issue}
          offender={
            reportedType.includes("customer") ? "Customer" : "Contractor"
          }
          handleStrike={handleStrikeUser}
        />
      </Modal>

      <nav className="w-full h-24 flex items-center justify-between px-2">
        <button onClick={handleBack} className="flex items-center gap-3">
          <FaArrowLeft /> <span className="font-semibold ">Issues</span>
        </button>
        <div className="flex items-center justify-center gap-2 px-5 py-2 bg-white rounded-md">
          Status
          {status !== "RESOLVED" ? (
            <>
              <ComplaintsState />
              <p className="text-danger">{status}</p>
            </>
          ) : (
            <>
              <CompletedState />
              <p className="text-success">{status}</p>
            </>
          )}
        </div>
      </nav>

      <div className="grid grid-cols-2 w-full overflow-x-auto gap-6 mb-6">
        <Card
          data={reporter}
          title={reporterType}
          sanctions={sanctions}
          initiator={true}
        />
        <Card
          data={reported}
          sanctions={sanctions}
          title={reportedType}
          initiator={false}
        />
      </div>

      <div className="p-3 rounded-md bg-white w-full min-h-20">
        <div className="flex border-b border-b-[#e9e9e9] p-2.5 gap-1.5">
          <span className="text-[12px] border-r border-r-[#e9e9e9] pr-2">
            Date Assigned: {formatDate(assignedAt)}
          </span>
          <span className="text-[12px] border-r border-r-[#e9e9e9] pr-2">
            Date Logged: {formatDate(createdAt)}
          </span>
        </div>

        <div className="mt-3 p-3 w-full flex flex-col gap-2">
          <h2 className="text-[#3a3a3a]">Reason for the Issue</h2>
          <span className="bg-[#f9f9f9] w-full rounded-md text-[12px] p-3">
            {comment || "No comment provided."}
          </span>
        </div>
      </div>

      {/* TBC */}
      {/* <JobHistory /> */}

      <div className="flex items-center gap-2 mt-6">
        <button
          className="px-4 py-3 bg-[#dd0a0a] text-white rounded-md hover:text-[#dd0404] hover:border hover:bg-white hover:border-[#dd0404] duration-500 transition-all"
          onClick={() => handleModalOpen("issue")}
        >
          Sanction
        </button>
        {/* <button
          className="px-4 py-3 border border-black rounded-md text-[12px] hover:text-white hover:bg-black duration-500 transition-all"
          onClick={handleGotoChat}
        >
          View Chat
        </button> */}
      </div>
    </div>
  );
}

export default SingleIssue;
