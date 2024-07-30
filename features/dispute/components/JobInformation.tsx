"use client";

import React, { useState, useRef, useContext } from "react";
import useDisputes from "@/lib/hooks/useDisputes";
import ContractorInfo from "./ContractorInfo";
import JobDayData from "./JobDayData";
import JobDetail from "./JobDetail";
import DisputeForm from "./DisputeForm";
import ResolvedForm from "./ResolvedForm";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { useParams } from "next/navigation";
import LoadingTemplate from "@/features/layout/loading";
import JobMedia from "./JobMedia";
import { useQuery } from "react-query";
import { dispute } from "@/lib/api/dispute";
import { UserContext } from "@/context/user-context";

const JobInformation = () => {
  const { singleDispute, loadingSingleDispute } = useDisputes();

  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef(null);
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  // console.log(singleDispute);

  // console.log(currentUser);

  const c_id =
    singleDispute?.data?.conversations?.arbitratorContractorConversation?.id;

  const { data: contractorChat } = useQuery(
    ["Contractor Arbitrator Conversation Messages"],
    () => dispute.getConversationMessages(c_id),
    {
      cacheTime: 100,
      staleTime: 100,
      refetchOnWindowFocus: true,
      // refetchInterval: 3000,
      enabled: Boolean(singleDispute),
      select: (data) => data?.data,
    }
  );

  const customer_id =
    singleDispute?.data?.conversations?.arbitratorCustomerConversation?.id;

  const { data: customerChat } = useQuery(
    ["Customer Arbitrator Conversation"],
    () => dispute.getConversationMessages(customer_id),
    {
      cacheTime: 100,
      staleTime: 100,
      refetchOnWindowFocus: true,
      // refetchInterval: 3000,
      enabled: Boolean(singleDispute),
      select: (data) => data?.data,
    }
  );

  // console.log(contractorChat);

  const unreadContractorCount = contractorChat?.data?.reduce(
    (sum: any, message: any) => {
      return sum + (message.readBy.includes(currentUser?._id) ? 0 : 1);
    },
    0
  );

  const unreadCustomerCount = customerChat?.data?.reduce(
    (sum: any, message: any) => {
      return sum + (message.readBy.includes(currentUser?._id) ? 0 : 1);
    },
    0
  );

  // console.log(unreadContractorCount);

  return (
    <>
      {loadingSingleDispute && <LoadingTemplate />}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <ResolvedForm setOpen={setOpen} id={id} />
      </Modal>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-5">
          <ContractorInfo
            title={"Contractor"}
            count={unreadContractorCount}
            info={singleDispute?.data?.contractor}
          />
          <ContractorInfo
            title={"Customer"}
            count={unreadCustomerCount}
            info={singleDispute?.data?.customer}
          />
        </div>
        <JobDayData info={singleDispute?.data?.jobDay} />
        <JobDetail info={singleDispute?.data?.job} />
        <JobMedia info={singleDispute?.data?.jobDay} />
        <DisputeForm info={singleDispute?.data?.description} />
        <button
          onClick={() => setOpen(true)}
          className={`text-white px-8 py-3 rounded-md text-sm bg-black`}
        >
          Resolve
        </button>
      </div>
    </>
  );
};

export default JobInformation;
