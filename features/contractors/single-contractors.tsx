"use client";
import React, { useRef, useState } from "react";
import Header from "../shared/inner-pages/header";
import Wrapper from "../shared/inner-pages/wrapper";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { RatingStar } from "@/public/svg";
import GoBack from "../shared/go-back-button/go-back";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import Image from "next/image";

import { extractFirstLetter } from "@/lib/utils/extract-initials";
import ActionColumn from "../shared/inner-pages/action-column";
import ActionButton from "../shared/inner-pages/action-button";

import LoadingTemplate from "../layout/loading";
import { redirect, useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { contractors } from "../../lib/api/contractors";
import useContractors from "@/lib/hooks/useContractors";
import Modal from "react-responsive-modal";
import DeleteModal from "../customise/components/promotions/DeleteModal";
import SubmitBtn from "@/components/ui/submit-btn";
import useAdminPermissions from "@/lib/hooks/useAdminPermissions";

const SingleContractor = () => {
  // const { value: contractorDetails } = useAppSelector(
  //   (state: RootState) => state.singleContractorDetail
  // );

  const [open, setOpen] = useState<{
    manualCertn: boolean;
    delete: boolean;
    openModal: boolean;
    sanction: any;
    promote: boolean;
  }>({
    manualCertn: false,
    delete: false,
    openModal: false,
    sanction: null,
    promote: false,
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
    removeSanction,
    promoteContractor,
    isPromotingContractor,
    demoteContractor,
    isDemotingContractor,
  } = useContractors();
  const queryClient = useQueryClient();

  function openModal(name: "manualCertn" | "delete" | "openModal" | "promote") {
    setOpen({ ...open, [name]: true });
  }

  function closeModal(
    name: "manualCertn" | "delete" | "openModal" | "promote"
  ) {
    setOpen({ ...open, [name]: false });
  }
  const { adminPermissions } = useAdminPermissions();

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

  const {
    isLoading: loadingInfo,
    data,
    refetch: refetchSingle,
    isRefetching,
  } = useQuery(
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
  // console.log(contractorInfo?.sanctions);

  const isElite = contractorInfo?.isElite;

  const handlePromoteContractor = async () => {
    try {
      toast.loading(
        isElite
          ? "Demoting Contractor.. .. .. .."
          : "promoting contractor.. .. .. .."
      );

      isElite
        ? await demoteContractor({
            email: contractorInfo?.email,
          })
        : await promoteContractor({
            email: contractorInfo?.email,
          });

      toast.remove();
      toast.success(
        isElite
          ? "Contractor demoted successfully"
          : "Contractor promoted successfully"
      );

      closeModal("promote");
      await refetchSingle();
    } catch (error: any) {
      toast.remove();
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleChangeStatus = async () => {
    if (!adminPermissions.data.includes("manage_contractors")) {
      toast.error("You don't have permission to update contractor");
      return;
    }
    toast.loading("Processing...");
    try {
      const data = await giveManualCertn({ id });

      toast.remove();
      toast.success("Certn given successfully");
      refetchSingle();
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

  const handleRemoveSanction = async () => {
    try {
      toast.loading("Processing...");

      await removeSanction({
        id: id as string,
        ...(open?.sanction && {
          payload: {
            sanctionId: open?.sanction,
          },
        }),
      });

      toast.remove();
      refetchSingle();

      toast.success("Sanction removed successfully");
      closeModal("openModal");
    } catch (error: any) {
      toast.remove();
      toast.error(
        error?.response?.data?.message || "unable to remove sanction"
      );
    }
  };

  // console.log(contractorInfo);

  return (
    <>
      {loadingInfo || isRefetching ? <LoadingTemplate /> : null}
      <Header>
        <Wrapper>
          <div className="flex gap-x-6 item-center">
            <div className="w-[86px] h-[86px] flex item-center justify-center">
              {contractorInfo?.profilePhoto?.url && (
                <Image
                  src={contractorInfo?.profilePhoto?.url}
                  alt=""
                  width={87}
                  height={87}
                  className="rounded-[50%]"
                />
              )}
              {!contractorInfo?.profilePhoto?.url && (
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
                onClose={() =>
                  setOpen((prev) => ({
                    ...prev,
                    openModal: false,
                  }))
                }
                open={open.openModal}
                center
                classNames={{
                  modal: "customModal",
                }}
                container={editRef.current}
              >
                <div className="w-[400px] px-4">
                  <h1 className="font-semibold text-center text-xl mb-4">
                    Remove Sanction
                  </h1>

                  <div className="flex flex-col gap-2">
                    <p>Select the sanction to remove (optional)</p>
                    <select
                      name=""
                      id=""
                      className="border py-2 w-full"
                      onChange={(e) =>
                        setOpen((prev) => ({
                          ...prev,
                          sanction: e.target.value,
                        }))
                      }
                    >
                      <option value="">All</option>
                      {contractorInfo?.sanctions?.map(
                        (item: any, i: number) => (
                          <option value={item?._id} key={item?._id}>
                            {item?.reason}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="w-full items-center mt-6 flex gap-3">
                    {/* <button
                      className="bg-gray-200 h-12 w-full  flex items-center rounded-md justify-center text-gray-800"
                      onClick={() => {}}
                    >
                      Cancel
                    </button> */}
                    <SubmitBtn
                      onClick={handleRemoveSanction}
                      isSubmitting={false}
                      spaceUp=""
                    >
                      Proceed
                    </SubmitBtn>
                  </div>
                </div>
              </Modal>

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
                onClose={() => closeModal("promote")}
                open={open.promote}
                center
                classNames={{
                  modal: "customModal",
                }}
                container={deleteRef.current}
              >
                <div className="w-full max-w-[450px] px-2 py-8">
                  <h1 className="font-semibold text-center">
                    You are about to {isElite ? "Demote" : "promote"}{" "}
                    <span
                      className={isElite ? "text-red-600" : "text-blue-600"}
                    >
                      {contractorInfo?.name}
                    </span>{" "}
                    {isElite ? "from" : "to"} the elite contactor status
                  </h1>

                  <p className="py-2">
                    Kindly press the proceed button to confirm this action
                  </p>
                  <SubmitBtn
                    isSubmitting={isPromotingContractor || isDemotingContractor}
                    onClick={handlePromoteContractor}
                  >
                    Proceed
                  </SubmitBtn>
                </div>
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
                {/* {con?.document?.skill === undefined
                  ? "Not Submitted"
                  : contractorDetails?.document?.skill} */}
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
                  name="Free Certn"
                  value={contractorInfo?.hasFreeCertn ? "True" : "False"}
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

                <>
                  <SingleLineColumn
                    name="Strikes"
                    value={contractorInfo?.sanctions?.length}
                  />
                </>
                <>
                  <SingleLineColumn
                    name="Type"
                    value={
                      contractorInfo?.isElite
                        ? "Elite Technician"
                        : "Contractor"
                    }
                  />
                </>

                {contractorInfo?.sanctions?.length > 0 &&
                  contractorInfo?.sanctions?.map((item: any, i: number) => (
                    <SingleLineColumn
                      name={`Strike ${i + 1} reason`}
                      value={item?.reason}
                      key={item?._id || i}
                    />
                  ))}

                <SingleLineColumn
                  name="Account status"
                  value={contractorInfo?.status}
                />
                <ActionColumn>
                  <div className="flex items-center gap-x-4">
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

                    {
                      <ActionButton
                        actionName={
                          isElite
                            ? "Demote From Elite Technician"
                            : "Promote To Elite Technician"
                        }
                        onClick={() => openModal("promote")}
                        color={
                          isElite
                            ? "border-yellow-500 text-yellow-500"
                            : "border-blue-600 text-blue-600"
                        }
                      />
                    }

                    {contractorInfo?.sanctions?.length > 0 && (
                      <ActionButton
                        actionName="Remove Sanction"
                        onClick={() => openModal("openModal")}
                        color="border-yellow-500 text-yellow-500"
                      />
                    )}
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
