"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { useQuery, useQueryClient } from "react-query";
import { contractors } from "../../lib/api/contractors";
import useContractors from "@/lib/hooks/useContractors";
import Modal from "react-responsive-modal";
import DeleteModal from "../customise/components/promotions/DeleteModal";
import SubmitBtn from "@/components/ui/submit-btn";

const SingleContractor = () => {
  const { value: contractorDetails } = useAppSelector(
    (state: RootState) => state.singleContractorDetail
  );
  const [open, setOpen] = useState({
    manualCertn: false,
    delete: false,
  });
  const router = useRouter();
  const editRef = useRef();
  const deleteRef = useRef();

  const {
    SuspendContractor,
    giveManualCertn,
    isUpdating,
    deleteContractor,
    isDeleting,
  } = useContractors();
  const queryClient = useQueryClient();

  function openModal(name: "manualCertn" | "delete") {
    setOpen({ ...open, [name]: true });
  }

  function closeModal(name: "manualCertn" | "delete") {
    setOpen({ ...open, [name]: false });
  }

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

  // const stringified_jobs =
  //   typeof window !== undefined
  //     ? sessionStorage.getItem("current_contractor_jobs")
  //     : null;

  // const current_contractor_jobs = stringified_jobs
  //   ? JSON?.parse(stringified_jobs)
  //   : [];

  // console.log(current_contractor_jobs);

  const { isLoading: loadingInfo, data } = useQuery(
    ["Contractor Information", id],
    () => {
      return contractors.getContractorDetails({
        id,
      });
    },
    {
      refetchOnWindowFocus: true,
      select: (response) => response?.data,
    }
  );

  const contractorInfo = data?.contractor;
  // console.log(contractorInfo);

  const handleChangeStatus = async () => {
    toast.loading("Processing...");
    try {
      const data = await giveManualCertn({ id });

      toast.remove();
      toast.success("Certn given successfully");
      router.push(`/contractors/${id}`);
      closeModal("manualCertn");
      queryClient.invalidateQueries("Contractor Information"); // Invalidate the query to re-fetch data
    } catch (e: any) {
      toast.remove();
      toast.error(
        e?.response?.data?.message || "unable to give contractor status"
      );
    }
  };

  // console.log(
  //   contractorInfo?.profile.availability.map((av) => av.day.join(", "))
  // );

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

              <Modal
                onClose={() => closeModal("delete")}
                open={open.delete}
                center
                classNames={{
                  modal: "customModal",
                }}
                container={deleteRef.current}
              >
                <DeleteModal
                  name="Contractor"
                  closeModal={() => closeModal("delete")}
                  onSubmit={deleteContractor}
                  type=""
                  title={`Are you sure you want to delete Contractor? `}
                  who="contractor"
                />
              </Modal>

              <Modal
                onClose={() => closeModal("manualCertn")}
                open={open.manualCertn}
                center
                classNames={{
                  modal: "customModal",
                }}
                container={editRef.current}
              >
                <div className="max-w-[400px] px-4">
                  <h1 className="font-semibold text-center text-xl">
                    Are you sure you want to Manually give{" "}
                    <span className="text-red-600 font-bold ">
                      {contractorInfo?.name}
                    </span>{" "}
                    Certn pass?
                  </h1>

                  <p className="text-gray-400 text-center text-sm">
                    Make sure he passed the necessary criteria before you
                    proceed
                  </p>

                  <div className="w-full items-center flex gap-3">
                    <button
                      className="bg-gray-200 h-12 w-full mt-5 flex items-center rounded-md justify-center text-gray-800"
                      onClick={() => {
                        closeModal("manualCertn");
                      }}
                    >
                      Cancel
                    </button>
                    <SubmitBtn
                      isSubmitting={isUpdating}
                      onClick={handleChangeStatus}
                    >
                      Proceed
                    </SubmitBtn>
                  </div>
                </div>
              </Modal>
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
                      ? `${contractorInfo?.phoneNumber?.code || ""}${
                          contractorInfo?.phoneNumber?.number || ""
                        }`
                      : "-"
                  }
                />
                <SingleLineColumn
                  name="Certn Status"
                  value={contractorInfo?.certnStatus}
                />
                <SingleLineColumn
                  name="Skills"
                  value={
                    contractorInfo?.profile?.skill ||
                    contractorInfo?.profile?.skills?.map(
                      (skill: string, index: number) => (
                        <span key={skill} className="text-sm">
                          {skill}
                          {index < contractorInfo?.profile?.skills.length - 1 &&
                            " || "}
                        </span>
                      )
                    )
                  }
                />
                <SingleLineColumn
                  name="Available Days"
                  value={
                    <div className="flex items-center gap-2 ">
                      {contractorInfo?.profile?.availability?.map((av: any) => (
                        <p key={av?.day} className="">
                          {av?.day}
                        </p>
                      ))}
                    </div>
                  }
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
                {/* <SingleLineColumn name="Amount Spent" value="$" /> */}
                <SingleLineColumn
                  name="NO. of jobs Completed"
                  value={contractorInfo?.stats?.jobsCompleted}
                />
                {contractorInfo?.companyName ? (
                  <SingleLineColumn
                    name="Company name"
                    value={contractorInfo?.companyName}
                  />
                ) : null}
                <SingleLineColumn
                  name="Account status"
                  value={contractorInfo?.status}
                />
                <ActionColumn>
                  <div className="flex gap-x-4">
                    {contractorInfo?.certnStatus !== "COMPLETE" && (
                      <ActionButton
                        actionName="Manually assign Certn."
                        onClick={() => openModal("manualCertn")}
                        color="border-green-600 text-green-600"
                      />
                    )}

                    <ActionButton
                      actionName="Delete Contractor"
                      onClick={() => openModal("delete")}
                      color="border-red-600 text-red-600"
                    />
                  </div>
                </ActionColumn>
              </tbody>
            </table>
          </BorderRectangle>
        </div>

        <div className="mt-24 mb-10 flex flex-col">
          {/* <div className="self-end mb-7">
            <DownloadButton text="Download JOB HISTORY" />
          </div> */}
          {/* <JobsHistory jobHistory={current_contractor_jobs} /> */}
        </div>
      </Wrapper>
    </>
  );
};

export default SingleContractor;
