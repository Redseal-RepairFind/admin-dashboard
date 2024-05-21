"use client";
import GoBack from "@/features/shared/go-back-button/go-back";
import BorderRectangle from "@/features/shared/inner-pages/bordered-rect";
import Header from "@/features/shared/inner-pages/header";
import ProfileColumn from "@/features/shared/inner-pages/profile-column";
import Wrapper from "@/features/shared/inner-pages/wrapper";
import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import {
  ComplaintsState,
  CompletedState,
  PendingState,
  RatingStar,
  YellowStar,
} from "@/public/svg";
import React, { useLayoutEffect, useRef, useState } from "react";
import userOne from "@/public/user-one.png";
import SingleLineColumn from "@/features/shared/inner-pages/single-line-column";
import DescriptionColumn from "@/features/shared/inner-pages/description-column";
import StatusColumn from "@/features/shared/inner-pages/status-column";
import Image from "next/image";
import Reciept from "@/features/shared/reciept";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { extractInitials } from "@/lib/utils/extract-initials";

const Invoice = () => {
  const status = "Completed";
  const text = `Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus.`;
  const [showModal, setShowModal] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeModal = () => {
    setShowModal(false);
  };
  useOnClickOutside(ref, closeModal);

  const { value: contractorDetails, history } = useAppSelector(
    (state: RootState) => state.singleContractorDetail
  );

  const router = useRouter();
  useLayoutEffect(() => {
    if (
      contractorDetails.contractorProfile._id === "" ||
      !contractorDetails.contractorProfile._id
    ) {
      router.push("/contractors");
    }
  }, [contractorDetails.contractorProfile._id]);

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
            className="w-[600px] bg-white max-w-auto relative p-7 overflow-y-auto h-screen"
            ref={ref}
          >
            <Reciept jobDetail={history} closeModal={setShowModal} />
          </div>
        </div>
      </div>
      <div className={`mb-20`}>
        <Header>
          <Wrapper>
            <div className="flex items-center justify-between">
              <div className="flex gap-x-6 items-center">
                <div className="w-[86px] h-[86px] flex item-center justify-center">
                  {contractorDetails?.contractorProfile.profileImage && (
                    <Image
                      src={contractorDetails?.contractorProfile.profileImage}
                      alt=""
                      width={87}
                      height={87}
                      className="rounded-[50%]"
                    />
                  )}
                  {!contractorDetails?.contractorProfile.profileImage && (
                    <div className="w-[86px] h-[86px] rounded-[50%] bg-[#D9D9D9] flex items-center justify-center">
                      <p className="text-[30px] font-[600] text-white">
                        <span className="capitalize">
                          {extractInitials(
                            contractorDetails.contractorProfile.firstName
                          )}
                        </span>
                        <span className="capitalize">
                          {extractInitials(
                            contractorDetails.contractorProfile.lastName
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="-mt-2">
                  <p className="text-[28px] font-[600]">
                    <span className="capitalize">
                      {contractorDetails.contractorProfile.firstName}
                    </span>{" "}
                    <span className="capitalize">
                      {contractorDetails.contractorProfile.lastName}
                    </span>
                  </p>

                  <p className="mt-[2px] mb-[6px] text-sm capitalize">
                    {contractorDetails?.document?.skill === undefined
                      ? "Not Submitted"
                      : contractorDetails?.document?.skill}
                  </p>

                  <div className="flex gap-x-1">
                    {filledArrayFromNumber(5).map(
                      (contractorDetails, index) => (
                        <RatingStar key={index} />
                      )
                    )}
                  </div>
                </div>
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
                    position="Contractor’s profile"
                    name={history.customer?.fullName || ""}
                    phoneNumber={history.customer?.email || ""}
                    stars={4}
                    imageSrc={history.customer?.profileImg || ""}
                  />

                  <SingleLineColumn name="Job ID" value={history.job._id} />
                  <SingleLineColumn
                    name="Job Address"
                    value={history.job.address}
                  />
                  <DescriptionColumn
                    name="Job Description"
                    text={history.job.description}
                  />
                  <SingleLineColumn
                    name="Job Status"
                    value={history.job.status}
                  />
                  <SingleLineColumn
                    name="Job Inspection"
                    value={history.job.inspection.status ? "True" : "False"}
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
