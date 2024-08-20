"use client";

import React, { useState, useRef } from "react";
import { FaCaretLeft, FaArrowLeft } from "react-icons/fa";
import { ComplaintsState, CompletedState } from "@/public/svg";
import useEmergency from "@/lib/hooks/useEmergency";
// import JobInformation from "./components/JobInformation";
import { useRouter, useParams } from "next/navigation";
import SectionContainer from "../../features/dispute/components/SectionContainer";
import ContractorInfo from "../../features/dispute/components/ContractorInfo";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import SettleEmergency from "./components/SettleEmergency";
import Img from "../../features/dispute/components/Img";

const SingleDispute = () => {
  const [open, setOpen] = useState(false);

  const modalRef = useRef(null);

  const router = useRouter();

  const { id } = useParams();

  const { singleEmergency } = useEmergency();

  // console.log(singleEmergency);

  function validateUrl(url: string) {
    // Regular expression to validate URL starting with https://
    const urlPattern = /^https:\/\/[^\s/$.?#].[^\s]*$/i;

    // Test the URL against the pattern
    if (urlPattern.test(url)) {
      return url;
    } else {
      return null;
    }
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <SettleEmergency setOpen={setOpen} emergencyID={id} />
      </Modal>

      <div className="p-5">
        <div className="bg-white rounded-lg py-4 w-full px-5 mt-4 mb-8 font-semibold text-lg">
          Emergency
        </div>
        <div className="flex items-center justify-between">
          <button onClick={handleBack}>
            <FaArrowLeft />
          </button>
          <div className="flex items-center justify-center gap-2 px-5 py-2 bg-white">
            Status
            {singleEmergency?.data?.status !== "RESOLVED" ? (
              <>
                <ComplaintsState />
                <p className="text-danger">Active</p>
              </>
            ) : (
              <>
                <CompletedState />
                <p className="text-success">Resolved</p>
              </>
            )}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-5">
          <ContractorInfo
            title={"Contractor"}
            count={"not_applicable"}
            info={singleEmergency?.data?.contractor}
          />
          <ContractorInfo
            title={"Customer"}
            count={"not_applicable"}
            info={singleEmergency?.data?.customer}
          />
        </div>
        <div className="mt-5 w-full rounded-md">
          <SectionContainer title="Media">
            <div className="flex items-center justify-start flex-wrap gap-5 mb-5">
              {singleEmergency?.data?.media?.map((url: any, index: number) => (
                <Img url={validateUrl(url)} key={index} />
              ))}
            </div>
          </SectionContainer>
          <SectionContainer title="Description">
            <div className="pb-3">
              <p className="bg-gray-100 rounded-md p-2">
                {singleEmergency?.data?.description}
              </p>
            </div>
          </SectionContainer>
          <div className="w-full flex items-center justify-start gap-5">
            <button
              onClick={() => {
                // setResolveType("contractor");
                setOpen(true);
              }}
              className={`text-white px-8 py-3 rounded-md text-sm bg-black`}
            >
              Resolve Emergency
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleDispute;
