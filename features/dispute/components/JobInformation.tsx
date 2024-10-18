"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
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
import io, { Socket } from "socket.io-client";
import toast from "react-hot-toast";

const JobInformation = () => {
  const { singleDispute, loadingSingleDispute, refetchDispute } = useDisputes();

  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef(null);
  const { id } = useParams();

  const [resolveType, setResolveType] = useState<string>("");

  const { currentUser } = useContext(UserContext);

  // console.log(singleDispute);

  // console.log(currentUser);

  const c_id = singleDispute?.data?.conversations?.arbitratorContractor?._id;

  const { data: contractorChat, refetch: refetchContractor } = useQuery(
    ["Contractor Arbitrator Conversation"],
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
    singleDispute?.data?.conversations?.arbitratorCustomer?._id;

  const { data: customerChat, refetch: refetchCustomer } = useQuery(
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

  const token = sessionStorage.getItem("userToken");

  const url = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    let socket: Socket;

    if (token) {
      socket = io(`${url}`, {
        extraHeaders: {
          token,
        },
      });

      socket.on("connect", () => {
        console.log("connected to server");
      });

      socket.on("NEW_UNREAD_MESSAGE", (data: any) => {
        // console.log("Received conversation event:", data);
        setTimeout(() => {
          refetchCustomer();
          refetchContractor();
        }, 800);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      socket.on("error", (error) => {
        console.error("Socket.IO error:", error);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token]);

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
        <ResolvedForm resolveType={resolveType} setOpen={setOpen} id={id} />
      </Modal>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-5">
          <ContractorInfo
            title={"Contractor"}
            count={unreadContractorCount}
            info={singleDispute?.data?.contractor}
            refetch={refetchContractor}
          />
          <ContractorInfo
            title={"Customer"}
            count={unreadCustomerCount}
            info={singleDispute?.data?.customer}
            refetch={refetchCustomer}
          />
        </div>
        <JobDayData info={singleDispute?.data?.jobDay} />
        <JobDetail info={singleDispute?.data?.job} />
        <JobMedia info={singleDispute?.data?.jobDay} />
        <DisputeForm info={singleDispute?.data?.description} />
        <div className="w-full flex items-center justify-start gap-5">
          <button
            onClick={() => {
              setResolveType("contractor");
              setOpen(true);
            }}
            className={`text-white px-8 py-3 rounded-md text-sm bg-black`}
          >
            Pay Contractor
          </button>
          <button
            onClick={() => {
              setResolveType("customer");
              setOpen(true);
            }}
            className={`px-8 py-3 rounded-md text-sm border border-black`}
          >
            Refund Customer
          </button>
          <button
            onClick={() => {
              setResolveType("revisit");
              setOpen(true);
            }}
            className={`px-8 py-3 rounded-md text-sm border border-black`}
          >
            Enable Revisit
          </button>
        </div>
      </div>
    </>
  );
};

export default JobInformation;
