"use client";
import React, { useLayoutEffect } from "react";
import Header from "../shared/inner-pages/header";
import Wrapper from "../shared/inner-pages/wrapper";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { RatingStar } from "@/public/svg";
import GoBack from "../shared/go-back-button/go-back";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import JobsHistory from "./components/job-history";
import DownloadButton from "../shared/page-body/download-button";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { extractInitials } from "@/lib/utils/extract-initials";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "react-query";
import Image from "next/image";
import { customers } from "../../lib/api/customers";

const SingleCustomer = () => {
  const { value: customerDetails } = useAppSelector(
    (state: RootState) => state.singleCustomerDetail
  );

  const params = useParams();

  const id = params?.slug;

  console.log(id);

  const { isLoading, data: customerInfo } = useQuery(
    ["Customer Information", id],
    () => {
      return customers.getCustomerDetails({
        id,
      });
    },
    {
      refetchOnWindowFocus: true,
      select: (response) => response?.customer,
    }
  );

  console.log(customerInfo);

  const router = useRouter();
  // useLayoutEffect(() => {
  //   console.log(customerDetails.customer._id);
  //   if (customerDetails.customer._id === "") {
  //     router.push("/customers");
  //   }
  // }, []);

  return (
    <>
      <Header>
        <Wrapper>
          <div className="flex gap-x-6 items-center">
            {(customerInfo?.profilePhoto?.url === "" ||
              !customerInfo?.profilePhoto?.url) && (
              <div className="w-[86px] h-[86px] rounded-[50%] bg-[#D9D9D9] flex items-center justify-center">
                <p className="text-[30px] font-[600] text-white capitalize">
                  {extractInitials(customerDetails?.customer?.fullName)}
                </p>
              </div>
            )}

            {(customerInfo?.profilePhoto?.url !== "" ||
              customerInfo?.profilePhoto?.url) && (
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
                {customerInfo?.name}
              </p>
              <div className="flex gap-x-1">
                {filledArrayFromNumber(5).map((item, index) => (
                  <RatingStar key={index} />
                ))}
              </div>
            </div>
          </div>
        </Wrapper>
      </Header>

      <Wrapper>
        <div className="my-8">
          <GoBack />
        </div>
        <div className="">
          <BorderRectangle>
            <table className="w-full">
              <tbody>
                <SingleLineColumn name="Email" value={customerInfo?.email} />
                <SingleLineColumn
                  name="Contact"
                  value={`${customerInfo?.phoneNumber?.code}${customerInfo?.phoneNumber?.number}`}
                />
                <SingleLineColumn name="Amount Spent" value="$" />
                <SingleLineColumn
                  name="NO. of jobs"
                  value={
                    customerInfo?.jobHistory > 0
                      ? customerDetails?.jobHistory?.length?.toString()
                      : "No jobs yet"
                  }
                />
                <SingleLineColumn name="Payment account" value="" />
                <SingleLineColumn name="Address" value="" />
              </tbody>
            </table>
          </BorderRectangle>
        </div>

        <div className="mt-24 mb-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton text="Download JOB HISTORY" />
          </div>
          <JobsHistory jobHistory={customerDetails?.jobHistory} />
        </div>
      </Wrapper>
    </>
  );
};

export default SingleCustomer;
