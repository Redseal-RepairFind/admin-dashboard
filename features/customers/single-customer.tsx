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
import LoadingTemplate from "../layout/loading";
import { extractFirstLetter } from "@/lib/utils/extract-initials";
import ActionColumn from "../shared/inner-pages/action-column";
import ActionButton from "../shared/inner-pages/action-button";
import toast from "react-hot-toast";
import useCustomers from "@/lib/hooks/useCustomers";

const SingleCustomer = () => {
  const { value: customerDetails } = useAppSelector(
    (state: RootState) => state.singleCustomerDetail
  );

  const params = useParams();

  const { SuspendCustomer } = useCustomers();

  const id = params?.slug;

  // console.log(id);

  const { isLoading, data: customerInfo } = useQuery(
    ["Customer Information", id],
    () => {
      return customers.getCustomerDetails({
        id,
      });
    },
    {
      refetchOnWindowFocus: true,
      select: (response) => response?.data,
    }
  );

  // console.log(customerInfo);

  const router = useRouter();
  // useLayoutEffect(() => {
  //   console.log(customerDetails.customer._id);
  //   if (customerDetails.customer._id === "") {
  //     router.push("/customers");
  //   }
  // }, []);

  const handleChangeStatus = async (status: string) => {
    if (confirm("Kindly confirm this action")) {
      // console.log({
      //   status,
      //   customerId: customerInfo?._id,
      // });
      toast.loading("Processing...");
      try {
        const data = await SuspendCustomer({
          status,
          customerId: customerInfo?._id,
        });
        toast.remove();
        toast.success(data?.message);
        router.push("/customers");
      } catch (e: any) {
        toast.remove();
        toast.error(e?.response?.message);
      }
    }
  };

  if (isLoading) return <LoadingTemplate />;

  return (
    <>
      <Header>
        {isLoading && <LoadingTemplate />}
        <Wrapper>
          <div className="flex gap-x-6 items-center">
            <div className="w-[86px] h-[86px] flex item-center justify-center">
              {customerInfo?.profilePhoto?.url && (
                <Image
                  src={customerInfo?.profilePhoto?.url}
                  alt=""
                  width={87}
                  height={87}
                  className="rounded-[50%]"
                />
              )}
              {!customerInfo?.profilePhoto?.url && (
                <div className="w-[86px] h-[86px] rounded-[50%] bg-[#D9D9D9] flex items-center justify-center">
                  <p className="text-[30px] font-[600] text-white">
                    <span className="capitalize">
                      {extractFirstLetter(customerInfo?.firstName)}
                    </span>
                    <span className="capitalize">
                      {extractFirstLetter(customerInfo?.lastName)}
                    </span>
                  </p>
                </div>
              )}
            </div>

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
                <SingleLineColumn
                  name="Email"
                  value={customerInfo?.email || ""}
                />
                <SingleLineColumn
                  name="Contact"
                  value={
                    customerInfo?.phoneNumber
                      ? `${customerInfo?.phoneNumber?.code}  ${customerInfo?.phoneNumber?.number}`
                      : "-"
                  }
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
                {/* <SingleLineColumn name="Address" value="" /> */}
                {/* <ActionColumn>
                  <div className="flex gap-x-4">
                    {customerInfo?.status !== "active" && (
                      <ActionButton
                        actionName="Activate"
                        onClick={() => handleChangeStatus("ACTIVE")}
                        color="border-green-600 text-green-600"
                      />
                    )}
                    {customerInfo?.status === "active" && (
                      <ActionButton
                        actionName="Suspend"
                        onClick={() => handleChangeStatus("suspend")}
                        color="border-red-600 text-red-600"
                      />
                    )}
                  </div>
                </ActionColumn> */}
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
