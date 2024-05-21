"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import Header from "../../shared/inner-pages/header";
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
import LoadingTemplate from "@/features/layout/loading";
import {
  getSingleContractorsDetail,
  getSingleCustomerDetail,
} from "@/lib/api/api";
import { IContractorsDetails, ICustomerData } from "@/lib/types";
import Reciept from "./reciept";

const Invoice = () => {
  const text = `Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus. Lorem ipsum dolor sit amet consectetur. At leo felis etiam massa maecenas eget fermentum lacus.`;
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeModal = () => {
    setShowModal(false);
  };
  useOnClickOutside(ref, closeModal);

  const router = useRouter();
  const { value: transaction } = useAppSelector(
    (state: RootState) => state.singleTransaction
  );
  useLayoutEffect(() => {
    if (transaction.transaction._id === "") {
      router.push("/transactions");
      return;
    }
  }, []);

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
            <Reciept
              transactionDetail={transaction}
              closeModal={setShowModal}
            />
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
          {isLoading && <LoadingTemplate />}
          <div className="mt-10">
            <BorderRectangle>
              <table className="w-full">
                <tbody>
                  <ProfileColumn
                    position="Customer’s profile"
                    name={transaction.customer.fullName}
                    phoneNumber={transaction.customer.phoneNumber}
                    stars={1}
                    imageSrc={transaction.customer.profileImg}
                  />
                  <ProfileColumn
                    position="Contractor’s profile"
                    name={`${transaction.contractor.firstName} ${transaction.contractor.lastName}`}
                    phoneNumber={transaction.contractor.email}
                    stars={4}
                    imageSrc={transaction.contractor.profileImage}
                  />
                  <SingleLineColumn
                    name="Invoice ID"
                    value={transaction.transaction.invoiceId}
                  />
                  <SingleLineColumn
                    name="Job Address"
                    value={transaction.job.address}
                  />
                  <SingleLineColumn
                    name="Job Status"
                    value={transaction.job.status}
                  />
                  <SingleLineColumn
                    name="Job Inspection"
                    value={transaction.job.inspection.status ? "True" : "False"}
                  />
                  {/* <SingleLineColumn
                    name=""
                    value={}
                  />
                  <SingleLineColumn
                    name=""
                    value={}
                  /> */}
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
