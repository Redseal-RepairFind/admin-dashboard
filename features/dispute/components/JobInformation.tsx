"use client";

import React, { useState, useRef } from "react";
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

const JobInformation = () => {
  const { singleDispute, loadingSingleDispute } = useDisputes();

  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef(null);
  const { id } = useParams();

  console.log(singleDispute);

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
            info={singleDispute?.data?.contractor}
          />
          <ContractorInfo
            title={"Customer"}
            info={singleDispute?.data?.customer}
          />
        </div>
        <JobDayData info={singleDispute?.data?.jobDay} />
        <JobDetail info={singleDispute?.data?.job} />
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
