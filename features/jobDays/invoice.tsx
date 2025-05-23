"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import Wrapper from "@/features/shared/inner-pages/wrapper";
import BorderRectangle from "@/features/shared/inner-pages/bordered-rect";
import ProfileColumn from "@/features/shared/inner-pages/profile-column";

import userOne from "@/public/user-one.png";
import userTwo from "@/public/user-two.png";
import SingleLineColumn from "@/features/shared/inner-pages/single-line-column";
import StatusColumn from "@/features/shared/inner-pages/status-column";
import DescriptionColumn from "@/features/shared/inner-pages/description-column";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";
import GoBack from "@/features/shared/go-back-button/go-back";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import Reciept from "@/features/shared/reciept";
import LoadingTemplate from "@/features/layout/loading";
import { useJobTable } from "../jobs/hooks/table";
import Header from "../shared/inner-pages/header";
// import Header from "../layout/header/header";

const Invoice = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeModal = () => {
    setShowModal(false);
  };
  useOnClickOutside(ref, closeModal);

  const { loadingSingleJob, aingleJob } = useJobTable({});

  const jobDetail = aingleJob?.data;

  const router = useRouter();
  // useLayoutEffect(() => {
  //   if (jobDetail._id === "") {
  //     router.push("/jobs");
  //   }
  // }, [jobDetail._id]);
  // const [isLoading, setIsLoading] = useState(false);

  if (loadingSingleJob) {
    return <LoadingTemplate />;
  }
  return (
    <>
      {/* Modal */}
      <div
        className={`${
          !showModal ? "hidden" : "block"
        } bg-[#000]/20 backdrop-blur-sm h-screen fixed z-10 w-full`}
      >
        <div className="flex w-full justify-center">
          <div
            className="w-[600px] bg-white max-w-auto relative  overflow-y-auto h-screen"
            ref={ref}
          >
            <Reciept jobDetail={jobDetail} closeModal={setShowModal} />
          </div>
        </div>
      </div>
      <div className={`mb-20`}>
        <Header>
          <Wrapper>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image
                  src="/invoice-page-logo.svg"
                  alt="logo"
                  width={70}
                  height={70}
                />
                <p className="text-[26px] font-[600] ml-4">RepairFind</p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="border border-[#333] p-3 uppercase h-fit text-[13px] font-[700] cursor-pointer outline-none"
              >
                View Invoice
              </button>
            </div>
          </Wrapper>
        </Header>

        <Wrapper>
          <div className="my-8">
            <GoBack />
          </div>

          <div className="mt-10">
            <BorderRectangle>
              <table className="w-full">
                <tbody>
                  <ProfileColumn
                    position="Customer’s profile"
                    name={jobDetail?.customer?.name || "-"}
                    phoneNumber={
                      jobDetail?.customer?.phoneNumber?.number || "-"
                    }
                    stars={1}
                    imageSrc={jobDetail?.customer?.profilePhoto?.url}
                  />
                  <SingleLineColumn name="Job ID" value={jobDetail?._id} />
                  <SingleLineColumn
                    name="Job Address"
                    value={jobDetail?.location?.address}
                  />

                  <DescriptionColumn
                    name="Job Description"
                    text={jobDetail?.description}
                  />
                  <SingleLineColumn
                    name="Job Status"
                    value={jobDetail?.status}
                  />
                  <SingleLineColumn
                    name="Job Inspection"
                    value={jobDetail?.isAssigned?.status ? "True" : "False"}
                  />
                </tbody>
              </table>
            </BorderRectangle>
          </div>
        </Wrapper>
      </div>
    </>
  );
};

export default Invoice;
