"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { ComplaintsState, CompletedState } from "@/public/svg";
import image from "@/public/admin-pic.png";
import { Modal } from "react-responsive-modal";
import { customers } from "@/lib/api/customers";
import { formatDate } from "@/lib/utils/format-date";
import { useRouter } from "next/navigation";

import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { useSortedData } from "@/lib/hooks/useSortedData";
import LoadingTemplate from "@/features/layout/loading";
import Card from "@/features/issues/Card";
import useFeedbacks from "@/lib/hooks/useFeedbacks";
import JobDayData from "@/features/dispute/components/SectionContainer";
import { useForm } from "react-hook-form";
import Image from "next/image";
import SingleLineColumn from "@/features/shared/inner-pages/single-line-column";

function SingleFeedback() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    singleFeedBack,
    loadingDetails,
    acceptFeedback,
    replyFeedback,
    refetchSingleFeedback,
    acceptingFeedback,
    replyingFeedback,
    refetchData,
  } = useFeedbacks();

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url); // Check for image extensions
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|avi|mov|mkv)$/i.test(url); // Check for video extensions
  };

  // console.log(singleFeedBack);

  const [openModal, setOpenModal] = useState({
    accept: false,
    respond: false,
  });

  const handleModalClose = (card: "accept" | "respond") => {
    setOpenModal({ ...openModal, [card]: false });
  };
  const handleModalOpen = (card: "accept" | "respond") => {
    setOpenModal({ ...openModal, [card]: true });
  };

  // Handle navigation
  const handleBack = () => {
    router.back();
    sessionStorage.removeItem("chatId");
  };

  async function handleAccept(id: any) {
    toast.loading(`Accepting feedback...`);
    try {
      const data = await acceptFeedback(id);
      // console.log(data);

      toast.remove();
      toast.success(data?.message || "Feedback accepted");
      handleModalClose("accept");

      refetchSingleFeedback();
    } catch (error: any) {
      toast.remove();
      toast.error(error?.message || "Failed to accept user feed back");
    }
  }

  async function handleResponse(data: any) {
    toast.loading(`Sending Response...`);

    const payload = {
      payload: { message: data?.message },
      id: singleFeedBack?.data?._id,
    };
    try {
      const data = await replyFeedback(payload);
      // console.log(data);

      toast.remove();
      toast.success(data?.message || "Feedback Response sent successfully");
      handleModalClose("respond");

      refetchSingleFeedback();
      refetchData();
    } catch (error: any) {
      toast.remove();
      toast.error(error?.message || "Failed to respond to user feed back");
    }
  }

  // Loading state rendering
  if (loadingDetails) {
    return <LoadingTemplate />;
  }

  // Fallback for missing issue data

  // console.log(issue);

  // console.log(issue);

  return (
    <div className="px-8 py-5">
      <div className="bg-white rounded-lg py-4 w-full px-5 mt-4 mb-8 font-semibold text-lg">
        Feed back
      </div>

      <Modal
        open={openModal.accept}
        onClose={() => handleModalClose("accept")}
        center
        classNames={{
          modal: "customModal",
        }}
      >
        <div className="w-[400px] h-40 flex flex-col gap-6">
          <h1 className="text-center font-bold text-xl">
            Accept and Respond to Feed back
          </h1>

          <p className="text-sm text-center">
            By accepting this you are taking the responsibility of replying the
            user and relaying the feedback to the appropriate authority, click
            the button below to proceed
          </p>
          <div className="flex w-full">
            <button
              className="px-4 py-3 bg-gray-800 text-white rounded-md   hover:border hover:bg-gray-800 hover:border-gray-800 duration-500 transition-all w-full"
              onClick={() => handleAccept(singleFeedBack?.data?._id)}
              disabled={acceptingFeedback}
            >
              Proceed
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openModal.respond}
        onClose={() => handleModalClose("respond")}
        classNames={{
          modal: "customModal",
        }}
        center
      >
        <form
          className="w-[400px] h-40 flex flex-col gap-6"
          onSubmit={handleSubmit(handleResponse)}
        >
          <h1 className="text-center font-bold text-xl">
            Kindly Respond to User&apos;s Feedback
          </h1>

          <textarea
            className={`w-full outline-none border p-2 ${
              errors?.message ? "border-red-600" : "border-gray-800"
            } rounded-md`}
            cols={5}
            rows={5}
            {...register("message", {
              required:
                "Kindly write a short but understandable response to the user",
            })}
          />
          {errors?.message && (
            <p className="text-red-700 text-xs">
              {errors?.message?.message?.toString()}
            </p>
          )}
          <div className="flex w-full">
            <button
              className="px-4 py-3 bg-gray-800 text-white rounded-md   hover:border hover:bg-gray-800 hover:border-gray-800 duration-500 transition-all w-full"
              disabled={replyingFeedback}
            >
              Proceed
            </button>
          </div>
        </form>
      </Modal>

      <nav className="w-full h-24 flex items-center justify-between px-2">
        <button onClick={handleBack} className="flex items-center gap-3">
          <FaArrowLeft /> <span className="font-semibold ">Feedbacks</span>
        </button>
        <div className="flex items-center justify-center gap-2 px-5 py-2 bg-white rounded-md">
          Status
          {singleFeedBack?.data?.status !== "CLOSED" ? (
            <>
              <ComplaintsState />
              <p className="text-danger">{singleFeedBack?.data?.status}</p>
            </>
          ) : (
            <>
              <CompletedState />
              <p className="text-success">{singleFeedBack?.data?.status}</p>
            </>
          )}
        </div>
      </nav>

      <div className="grid grid-cols-2 w-full overflow-x-auto gap-6 mb-6">
        <Card
          data={singleFeedBack?.data?.user}
          title={singleFeedBack?.data?.userType}
          sanctions={null}
          initiator={true}
        />
        {/* <Card
          data={reported}
          sanctions={sanctions}
          title={reportedType}
          initiator={false}
        /> */}
      </div>

      <div className="p-3 rounded-md bg-white w-full min-h-20">
        <div className="flex border-b border-b-[#e9e9e9] p-2.5 gap-1.5">
          <span className="text-[12px] border-r border-r-[#e9e9e9] pr-2">
            Date Logged: {formatDate(singleFeedBack?.data?.createdAt)}{" "}
          </span>
          {singleFeedBack?.data?.response && (
            <span className="text-[12px] border-r border-r-[#e9e9e9] pr-2">
              Response Date :{" "}
              {formatDate(singleFeedBack?.data?.response?.replyAt)}
            </span>
          )}
        </div>

        <div className="mt-3 p-3 w-full flex flex-col gap-2">
          <h2 className="text-[#3a3a3a]">Feedback</h2>
          <span className="bg-[#f9f9f9] w-full rounded-md text-[12px] p-3">
            {singleFeedBack?.data?.remark || "No comment provided."}
          </span>
        </div>
        <JobDayData title="Medias" className="bg-[#f9f9f9]">
          <div className="flex flex-col w-[600px] h-[300px] relative gap-4">
            {singleFeedBack?.data?.media.map((media: string, index: number) => {
              if (isImage(media)) {
                return (
                  <Image
                    key={index}
                    src={media}
                    alt="Feedback Media"
                    className="rounded-[20px] max-h-[300px] object-cover"
                    fill
                  />
                );
              }

              if (isVideo(media)) {
                return (
                  <video
                    key={index}
                    controls
                    width="100%"
                    height="300"
                    className="rounded-[20px] max-h-[300px]"
                  >
                    <source src={media} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                );
              }

              // Fallback for unsupported media types
              return (
                <p key={index} className="text-gray-500">
                  Unsupported media type
                </p>
              );
            })}
          </div>
        </JobDayData>
      </div>

      {singleFeedBack?.data?.status === "CLOSED" ? (
        <div className="mt-3  w-full flex flex-col p-3 rounded-md bg-white gap-2">
          <table className="mt-3 p-3 w-full flex flex-col gap-2">
            <tbody>
              <th className="text-[#3a3a3a]">Admin Info</th>
              <SingleLineColumn
                name="Admin name:"
                value={singleFeedBack?.data?.response?.adminId?.name}
                className="gap-8 flex items-center"
              />

              <SingleLineColumn
                name="Admin Email:"
                value={singleFeedBack?.data?.response?.adminId?.email}
                className="gap-8 flex items-center"
              />
              {/* <SingleLineColumn
              name="How did you settle this issue:"
              value={action}
              className="gap-8 flex items-center"
            /> */}
            </tbody>
          </table>
          <h2 className="text-[#3a3a3a]">Admin Response</h2>
          <span className="bg-[#f9f9f9] w-full rounded-md text-[12px] p-3">
            {singleFeedBack?.data?.response?.message || "No Response yet."}
          </span>
        </div>
      ) : null}

      {/* TBC */}
      {/* <JobHistory /> */}

      <div className="flex items-center gap-2 mt-6">
        {singleFeedBack?.data?.status === "CLOSED" ? null : singleFeedBack?.data
            ?.status === "OPEN" ? (
          <button
            className="px-4 py-3 bg-gray-800 text-white rounded-md hover:text-gray-800 hover:border hover:bg-gray-700 hover:border-gray-800 duration-500 transition-all"
            onClick={() => handleModalOpen("accept")}
          >
            Attend to Feedback
          </button>
        ) : (
          <button
            className="px-4 py-3 bg-gray-800 text-white rounded-md hover:border hover:bg-gray-700 hover:border-gray-800 duration-500 transition-all"
            onClick={() => handleModalOpen("respond")}
          >
            Respond
          </button>
        )}
      </div>
    </div>
  );
}

export default SingleFeedback;
