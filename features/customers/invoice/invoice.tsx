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
} from "@/public/svg";
import React, { useLayoutEffect, useRef, useState } from "react";
import userOne from "@/public/user-one.png";
import SingleLineColumn from "@/features/shared/inner-pages/single-line-column";
import DescriptionColumn from "@/features/shared/inner-pages/description-column";
import StatusColumn from "@/features/shared/inner-pages/status-column";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { extractInitials } from "@/lib/utils/extract-initials";
import Image from "next/image";
import Reciept from "@/features/shared/reciept";

const Invoice = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeModal = () => {
    setShowModal(false);
  };
  useOnClickOutside(ref, closeModal);

  const { value: customerDetails, history } = useAppSelector(
    (state: RootState) => state.singleCustomerDetail
  );

  const router = useRouter();
  useLayoutEffect(() => {
    if (
      customerDetails.customer._id === "" ||
      customerDetails.customer._id === undefined
    ) {
      router.push("/customers");
    }
  }, [customerDetails.customer._id]);
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
                {(customerDetails.customer.profileImg === "" ||
                  !customerDetails.customer.profileImg) && (
                  <div className="w-[86px] h-[86px] rounded-[50%] bg-[#D9D9D9] flex items-center justify-center">
                    <p className="text-[30px] font-[600] text-white capitalize">
                      {extractInitials(customerDetails?.customer?.fullName)}
                    </p>
                  </div>
                )}

                {(customerDetails.customer.profileImg !== "" ||
                  customerDetails.customer.profileImg) && (
                  <Image
                    alt=""
                    width={60}
                    height={60}
                    src={customerDetails.customer.profileImg}
                    className="w-[80px] h-[80px] object-cover rounded-[50%]"
                  />
                )}

                <div className="-mt-2">
                  <p className="text-[28px] font-[600] capitalize">
                    {customerDetails?.customer?.fullName}
                  </p>
                  <div className="flex gap-x-1">
                    {filledArrayFromNumber(5).map((item, index) => (
                      <RatingStar key={index} />
                    ))}
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
                    name={`${history.contractor?.firstName} ${history.contractor?.lastName}`}
                    phoneNumber={history.contractor?.email || ""}
                    stars={4}
                    imageSrc={history.contractor?.profileImage || ""}
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
