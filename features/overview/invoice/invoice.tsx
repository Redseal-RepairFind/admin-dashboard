"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import Header from "../../shared/inner-pages/header";
import Wrapper from "@/features/shared/inner-pages/wrapper";
import BorderRectangle from "@/features/shared/inner-pages/bordered-rect";
import ProfileColumn from "@/features/shared/inner-pages/profile-column";
import SingleLineColumn from "@/features/shared/inner-pages/single-line-column";
import DescriptionColumn from "@/features/shared/inner-pages/description-column";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOnClickOutside } from "@/lib/hooks/use-on-click-outside";
import GoBack from "@/features/shared/go-back-button/go-back";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import Reciept from "@/features/shared/reciept";

const Invoice = () => {
  const text = `Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus.`;
  const [showModal, setShowModal] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeModal = () => {
    setShowModal(false);
  };
  useOnClickOutside(ref, closeModal);

  const router = useRouter();
  const { value: jobDetail } = useAppSelector(
    (state: RootState) => state.jobDetail
  );
  useLayoutEffect(() => {
    if (jobDetail.job._id === "") {
      router.push("/contractors");
    }
  }, []);
  // const [isLoading, setIsLoading] = useState(false);
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
                    name={jobDetail.customer.fullName}
                    phoneNumber={jobDetail.customer.phoneNumber}
                    stars={1}
                    imageSrc={jobDetail.customer.profileImg}
                  />
                  <ProfileColumn
                    position="Contractor’s profile"
                    name={`${jobDetail.contractor.firstName} ${jobDetail.contractor.lastName}`}
                    phoneNumber={jobDetail.contractor.email}
                    stars={4}
                    imageSrc={jobDetail.contractor.profileImage}
                  />
                  <SingleLineColumn name="Job ID" value={jobDetail.job._id} />
                  <SingleLineColumn
                    name="Job Address"
                    value={jobDetail.job.address}
                  />
                  <SingleLineColumn name="Quote" value="$4,000" />
                  <DescriptionColumn
                    name="Job Description"
                    text={jobDetail.job.description}
                  />
                  <SingleLineColumn
                    name="Job Status"
                    value={jobDetail.job.status}
                  />
                  <SingleLineColumn
                    name="Job Inspection"
                    value={jobDetail.job.inspection.status ? "True" : "False"}
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
