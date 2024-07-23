"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Header from "../shared/inner-pages/header";
import Wrapper from "../shared/inner-pages/wrapper";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { RatingStar } from "@/public/svg";
import GoBack from "../shared/go-back-button/go-back";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import Image from "next/image";
import JobsHistory from "./components/job-history";
import DownloadButton from "../shared/page-body/download-button";
import { RootState } from "@/lib/redux/store";
import { useAppSelector } from "@/lib/redux/hooks";
import { extractFirstLetter } from "@/lib/utils/extract-initials";
import ActionColumn from "../shared/inner-pages/action-column";
import ActionButton from "../shared/inner-pages/action-button";
import {
  changeContractorStatus,
  validateAContractorDocument,
} from "@/lib/api/api";
import LoadingTemplate from "../layout/loading";
import { redirect, useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { contractors } from "../../lib/api/contractors";
import useContractors from "@/lib/hooks/useContractors";

const SingleContractor = () => {
  const { value: contractorDetails } = useAppSelector(
    (state: RootState) => state.singleContractorDetail
  );

  const router = useRouter();

  const { SuspendContractor } = useContractors();

  // useLayoutEffect(() => {
  //   console.log(contractorDetails.contractorProfile._id);
  //   if (
  //     contractorDetails.contractorProfile._id === "" ||
  //     !contractorDetails.contractorProfile._id
  //   ) {
  //     router.push("/contractors");
  //   }
  // }, [contractorDetails.contractorProfile._id]);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  const id = params?.slug;

  // console.log(contractorDetails);

  // const stringified_jobs =
  //   typeof window !== undefined
  //     ? sessionStorage.getItem("current_contractor_jobs")
  //     : null;

  // const current_contractor_jobs = stringified_jobs
  //   ? JSON?.parse(stringified_jobs)
  //   : [];

  // console.log(current_contractor_jobs);

  const { isLoading: loadingInfo, data: contractorInfo } = useQuery(
    ["Contractor Information", id],
    () => {
      return contractors.getContractorDetails({
        id,
      });
    },
    {
      refetchOnWindowFocus: true,
      select: (response) => response?.contractor,
    }
  );

  // console.log(contractorInfo);

  const handleChangeStatus = async (status: string) => {
    if (confirm("Kindly confirm this action")) {
      toast.loading("Processing...");
      try {
        const data = await SuspendContractor({
          contractorId: contractorInfo?._id,
          status,
        });
        toast.remove();
        toast.success(data?.message);
        router.push("/contractors");
      } catch (e: any) {
        toast.remove();
        toast.error(e?.response?.message);
      }
    }
  };

  return (
    <>
      {loadingInfo && <LoadingTemplate />}
      <Header>
        <Wrapper>
          <div className="flex gap-x-6 item-center">
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
                      {extractFirstLetter(contractorInfo?.firstName || "U")}
                    </span>
                    <span className="capitalize">
                      {extractFirstLetter(contractorInfo?.lastName || "U")}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="-mt-2">
              <p className="text-[28px] font-[600]">
                <span className="capitalize">{contractorInfo?.name}</span>
              </p>

              <p className="mt-[2px] mb-[6px] text-sm capitalize">
                {contractorDetails?.document?.skill === undefined
                  ? "Not Submitted"
                  : contractorDetails?.document?.skill}
              </p>

              <div className="flex gap-x-1">
                {filledArrayFromNumber(5).map((contractorDetails, index) => (
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

        {isLoading && <LoadingTemplate />}
        <div className="">
          <BorderRectangle>
            <table className="w-full">
              <tbody>
                <SingleLineColumn name="Email" value={contractorInfo?.email} />
                <SingleLineColumn
                  name="Phone"
                  value={
                    contractorInfo?.phoneNumber
                      ? `${contractorInfo?.phoneNumber?.code}${contractorInfo?.phoneNumber?.number}`
                      : "-"
                  }
                />
                <SingleLineColumn
                  name="Certn Status"
                  value={contractorInfo?.certnReport?.status?.replace(
                    /_/g,
                    " "
                  )}
                />
                <SingleLineColumn
                  name="Skill"
                  value={contractorInfo?.profile?.skill}
                />
                <SingleLineColumn
                  name="Available Days"
                  value={contractorInfo?.profile?.availableDays?.join(",")}
                />
                <SingleLineColumn
                  name="City"
                  value={contractorInfo?.profile?.location?.address}
                />
                <SingleLineColumn
                  name="Website"
                  value={contractorInfo?.profile?.website}
                />
                <SingleLineColumn
                  name="Years of Exp."
                  value={contractorInfo?.profile?.experienceYear}
                />
                <SingleLineColumn name="Amount Spent" value="$" />
                <SingleLineColumn name="NO. of jobs" value="No jobs yet" />
                <SingleLineColumn name="Payment account" value="" />
                <SingleLineColumn
                  name="Account status"
                  value={contractorInfo?.status}
                />
                <ActionColumn>
                  <div className="flex gap-x-4">
                    {/* <ActionButton
                      actionName="Validate Document"
                      onClick={() => validateDocuments}
                      color="border-green-600 text-green-600"
                    />
                    <ActionButton
                      actionName="Activate"
                      onClick={() => handleChangeStatus("active")}
                      color="border-green-600 text-green-600"
                    />
                    <ActionButton
                      actionName="Review"
                      onClick={() => handleChangeStatus("in-review")}
                      color="border-yellow-500 text-yellow-500"
                    />
                    <ActionButton
                      actionName="Close"
                      onClick={() => handleChangeStatus("closed")}
                      color="border-red-600 text-red-600"
                    /> */}
                    {contractorInfo?.status !== "active" && (
                      <ActionButton
                        actionName="Activate"
                        onClick={() => handleChangeStatus("active")}
                        color="border-green-600 text-green-600"
                      />
                    )}
                    {contractorInfo?.status === "active" && (
                      <ActionButton
                        actionName="Suspend"
                        onClick={() => handleChangeStatus("suspend")}
                        color="border-red-600 text-red-600"
                      />
                    )}
                  </div>
                </ActionColumn>
              </tbody>
            </table>
          </BorderRectangle>
        </div>

        <div className="mt-24 mb-10 flex flex-col">
          <div className="self-end mb-7">
            <DownloadButton text="Download JOB HISTORY" />
          </div>
          {/* <JobsHistory jobHistory={current_contractor_jobs} /> */}
        </div>
      </Wrapper>
    </>
  );
};

export default SingleContractor;
