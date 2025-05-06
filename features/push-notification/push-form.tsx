"use client";

import { useNotifsCampaign } from "@/lib/hooks/useNotifCampaigns";
import { SubmitBtn } from "../quiz/components";

import { useEffect, useRef, useState } from "react";
import { Column, Label, Errors } from "../appVersion/mutateVersionForm";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import toast from "react-hot-toast";
import { useCheckedList } from "@/context/checked-context";
import CheckBox from "@/app/_components/Check-box";
import Image from "next/image";
import axios from "axios";
import { getSignUrls } from "@/lib/aws/aws-action";

const initContracSegs = {
  byAccountType: [],
  byLocation: [],
  byOnboardingStage: [],
  byRating: [],
  byReferral: [],
  bySkills: [],
  byStatus: [],
  createdAfter: [],
  createdBefore: [],
  noBackgroundCheck: [],
  noProfile_After_Hours: [],
};
const initCustSegs = {
  byLocation: [],
  byRating: [],
  byStatus: [],
  byReferral: [],
};

type SegmentType = {
  byAccountType: string[];
  byLocation: string[];
  byOnboardingStage: string[];
  byRating: string[];
  byReferral: string[];
  bySkills: string[];
  byStatus: string[];
  createdAfter: string[];
  createdBefore: string[];
  noBackgroundCheck: string[];
  noProfile_After_Hours: string[];
};

type SelectSegment =
  | "byAccountType"
  | "byLocation"
  | "byOnboardingStage"
  | "byRating"
  | "byReferral"
  | "bySkills"
  | "byStatus"
  | "createdAfter"
  | "createdBefore"
  | "noBackgroundCheck"
  | "noProfile_After_Hours";
type Isegment = "" | "All" | "Contractor" | "Customers";

const frequency = ["MINUTE", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];
const status = ["SENT", "SCHEDULED", "CANCELLED"];
const segmnt: Isegment[] = ["All", "Contractor", "Customers"];

const Form = ({
  type,
  editData,
  close,
}: {
  type: "edit" | "new" | "push";
  editData?: any;
  close: any;
}) => {
  const [selectedDate, setSelectedDate] = useState(
    type === "edit" ? editData?.schedule?.startDate : new Date()
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { checkedList, setCheckedList } = useCheckedList();
  const {
    refetchPushCamps,
    createCampaign,
    segments,
    updateCampaign,
    sendNotif,
  } = useNotifsCampaign();
  const contractorSecments = segments?.data?.contractor;
  const customerSecments = segments?.data?.customer;

  const [pushSegmentsContractors, setPushSegmentsContractors] =
    useState<SegmentType>(initContracSegs);
  const [pushSegmentsCustomers, setPushSegmentsCustomers] =
    useState(initCustSegs);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [segment, setSegment] = useState<Isegment>(
    type === "edit" ? "All" : ""
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    const selectedFile = e.target.files[0];

    // Optional: Validate file type (image only)
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    // toast.loading("Uploading image...");

    try {
      const { success, urls, error } = await getSignUrls([
        {
          filename: file.name,
          fileType: file.type,
        },
      ]);

      if (!success || !urls)
        throw new Error(error || "Failed to get signed URL");

      const { url, publicUrl } = urls[0];

      await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      setImageUrl(publicUrl);

      return publicUrl;
    } catch (err: any) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const selectSegment = (
    segment: SelectSegment,
    category: "contractors" | "customers",
    item: string
  ) => {
    const toggleItem = (list: string[]) =>
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

    if (category === "contractors") {
      setPushSegmentsContractors((prev: any) => ({
        ...prev,
        [segment]: toggleItem(prev[segment]),
      }));
    }

    if (category === "customers") {
      setPushSegmentsCustomers((prev: any) => ({
        ...prev,
        [segment]: toggleItem(prev[segment]),
      }));
    }

    // setCheckedList((prevData: any) =>
    //   prevData.includes(item)
    //     ? prevData.filter((i: any) => i !== item)
    //     : [...prevData, item]
    // );
  };

  const onSubmit = async (data: any) => {
    const payload = {
      title: data?.title,
      message: data?.message,
      channels: [data?.channel],
      status: data?.status,
      schedule: {
        startDate: selectedDate,
        recurring: data?.recurring === "true" ? true : false,
        interval: Number(data?.interval),
        frequency: data?.frequency,
      },
      contractorSegment: {
        byAccountType: data?.byAccountType,
        byLocation: data?.byLocation,
        byOnboardingStage: data?.byOnboardingStage,
        byRating: data?.byRating,
        byReferral: data?.byReferral,
        bySkills: data?.bySkills,
        byStatus: data?.byStatus,
        createdAfter: data?.createdAfter,
        createdBefore: data?.createdBefore,
        noBackgroundCheck: data?.noBackgroundCheck,
        noProfile_After_Hours: data?.noProfile_After_Hours,
      },
      customerSegment: {
        byRating: data?.byRatingc,
        byReferral: data?.byReferralc,
        byLocation: pushSegmentsCustomers.byLocation,
        byStatus: pushSegmentsCustomers.byStatus,
      },
    };

    // console.log(payload);

    try {
      toast.loading(
        type === "new"
          ? "Creating Campaign..."
          : type === "push"
          ? "Sending Push notifications..."
          : "Updating Campaign..."
      );

      if (type === "push") {
        const url = await handleUpload();
        const pushPayload = {
          title: data?.title,
          body: data?.message,
          imageUrl: url,
          segments: {
            contractors: {
              byRating: [data?.byRating],
              byReferral: [data?.byReferral],
              createdAfter: [data?.createdAfter],
              createdBefore: [data?.createdBefore],
              noBackgroundCheck: [data?.noBackgroundCheck],
              noProfile_After_Hours: [Number(data?.noProfile_After_Hours)],
              byAccountType: pushSegmentsContractors.byAccountType,
              byLocation: pushSegmentsContractors.byLocation,
              byOnboardingStage: pushSegmentsContractors.byOnboardingStage,
              bySkills: pushSegmentsContractors.bySkills,
              byStatus: pushSegmentsContractors.byStatus,
            },
            customers: {
              byRating: [data?.byRatingc],
              byReferral: [data?.byReferralc],
              byLocation: pushSegmentsCustomers.byLocation,
              byStatus: pushSegmentsCustomers.byStatus,
            },
          },
        };

        await sendNotif(pushPayload);

        // console.log(pushPayload);
      }
      if (type === "new") await createCampaign(payload);
      if (type === "edit") await updateCampaign({ payload, id: editData?._id });

      toast.remove();
      toast.success(
        type === "new"
          ? "Campaign Created Successfully"
          : type === "push"
          ? "Notifications sent successfully"
          : "Campaign Updated Successfully"
      );
      refetchPushCamps();
      close();
      setPushSegmentsContractors(initContracSegs);
      setPushSegmentsCustomers(initCustSegs);
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="w-full flex flex-col gap-6">
      <Column>
        <Label htmlFor="Title">Title</Label>
        <input
          type="text"
          className="border border-gray-700  rounded-md w-full h-12 px-2"
          placeholder="Campaign Title"
          {...register("title", {
            required: "Campaign title is required",
          })}
          defaultValue={type === "edit" ? editData?.title : ""}
        />
        {errors?.title?.message ? (
          <Errors>{errors?.title?.message}</Errors>
        ) : null}
      </Column>
      <Column>
        <Label htmlFor="Message">Message</Label>
        <textarea
          className=" px-2 border-gray-700 border rounded-md"
          {...register("message", {
            required: "Campaign message is required",
          })}
          cols={10}
          rows={6}
          placeholder="Enter Campaign Message"
          defaultValue={type === "edit" ? editData?.message : ""}
        />
        {errors?.message?.message ? (
          <Errors>{errors?.message?.message}</Errors>
        ) : null}
      </Column>

      {type === "push" ? (
        <div className="space-y-4">
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Select Image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {file && (
            <div className="text-sm text-gray-700">
              Selected:{" "}
              <Image
                src={URL.createObjectURL(file)} // Create an object URL only for File objects
                alt="Uploaded File"
                width={80}
                height={40}
              />
            </div>
          )}

          {imageUrl && (
            <div className="mt-4">
              <p className="mb-2 font-semibold">Uploaded Image Preview:</p>
              <Image
                src={imageUrl}
                alt="Uploaded Image"
                width={300}
                height={200}
                className="rounded border"
              />
            </div>
          )}
        </div>
      ) : null}
      <div className="grid grid-cols-3 gap-2">
        {type === "push" ? null : (
          <>
            <h2 className="text-xl mb-4">Schedules (Required)</h2> <div></div>{" "}
            <div></div>
            <Column>
              <Label htmlFor="Recurring">Recurring:</Label>
              <select
                id="recurring"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("recurring", {
                  required: "Please Select a Value",
                })}
                defaultValue={
                  type === "edit" ? editData?.schedule?.recurring : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  -- Select Recurring --
                </option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              {errors?.recurring?.message ? (
                <Errors>{errors?.recurring?.message}</Errors>
              ) : null}
            </Column>
            <Column>
              <Label htmlFor="Start date">Start Date</Label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: any) => setSelectedDate(date)}
                className="border border-gray-800 p-2 rounded-md text-sm w-full h-12 z-50"
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
              />
            </Column>
            <Column>
              <Label htmlFor="frequency">Frequency:</Label>
              <select
                id="frequency"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("frequency", {
                  required: "Please Select the Recurring Frequency",
                })}
                defaultValue={
                  type === "edit" ? editData?.schedule?.frequency : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  -- Select Frequency --
                </option>

                {frequency?.map((item: any, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors?.frequency?.message ? (
                <Errors>{errors?.frequency?.message}</Errors>
              ) : null}
            </Column>
            <Column>
              <Label htmlFor="Interval">Interval</Label>
              <input
                type="number"
                className="border border-gray-700  rounded-md w-full h-12 px-2"
                placeholder="Enter Interval"
                {...register("interval", {
                  required: "Please Enter a number of occurence per frequency",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Please enter a valid number",
                  },
                })}
                defaultValue={
                  type === "edit" ? editData?.schedule?.interval : ""
                }
              />
              {errors?.interval?.message ? (
                <Errors>{errors?.interval?.message}</Errors>
              ) : null}
            </Column>
            <Column>
              <Label htmlFor="channel">Channels:</Label>
              <select
                id="channel"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("channel", {
                  required: "Please Select a channel",
                })}
                defaultValue={type === "edit" ? editData?.channels[0] : ""}
              >
                <option value="" className="cursor-not-allowed">
                  -- Select Channel --
                </option>
                <option value="push">Push</option>
              </select>
              {errors?.channel?.message ? (
                <Errors>{errors?.channel?.message}</Errors>
              ) : null}
            </Column>
            <Column>
              <Label htmlFor="frequency">Status:</Label>
              <select
                id="status"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("status", {
                  required: "Please Select the status",
                })}
                defaultValue={type === "edit" ? editData?.status : ""}
              >
                <option value="" className="cursor-not-allowed">
                  {" "}
                  -- Select status --{" "}
                </option>

                {status?.map((item: any, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors?.status?.message ? (
                <Errors>{errors?.status?.message}</Errors>
              ) : null}
            </Column>
          </>
        )}
      </div>

      <h2
        className="text-[16px] font-semibold
          mt-4"
      >
        Select Segment
      </h2>
      <div className="flex items-center gap-2">
        <button
          className={`px-4 py-2 border rounded-md ${
            segment === "" ? "bg-gray-800 text-white" : ""
          }`}
          onClick={() => setSegment("")}
        >
          None
        </button>
        {segmnt.map((sgt) => (
          <button
            key={sgt}
            className={`px-4 py-2 border rounded-md ${
              sgt === segment ? "bg-gray-800 text-white" : ""
            }`}
            onClick={() => setSegment(sgt)}
          >
            {sgt}
          </button>
        ))}
      </div>
      {segment === "All" || segment === "Contractor" ? (
        <>
          <h2
            className="text-[16px] font-semibold
          my-4"
          >
            Contractor Segments (optional)
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <Column>
              <Label htmlFor="Account">By Account Type:</Label>
              {type === "push" ? (
                <SegmentsSelection
                  segments={contractorSecments?.byAccountType}
                  open={"byAccountType"}
                  type="contractors"
                  selectSegment={selectSegment}
                  selectedSegments={pushSegmentsContractors?.byAccountType}
                />
              ) : (
                <select
                  id="byAccountType"
                  className="h-12 px-2 border-gray-700 border rounded-md"
                  {...register("byAccountType")}
                  defaultValue={
                    type === "edit"
                      ? editData?.contractorSegment?.byAccountType
                      : ""
                  }
                >
                  <option value="" className="cursor-not-allowed">
                    {" "}
                    -- Select Account Type --{" "}
                  </option>

                  {contractorSecments?.byAccountType?.map(
                    (item: any, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              )}
            </Column>
            <Column>
              <Label htmlFor="Location">By Location:</Label>
              {type === "push" ? (
                <SegmentsSelection
                  segments={contractorSecments?.byLocation}
                  open={"byLocation"}
                  type="contractors"
                  selectSegment={selectSegment}
                  selectedSegments={pushSegmentsContractors?.byLocation}
                />
              ) : (
                <select
                  id="byLocation"
                  className="h-12 px-2 border-gray-700 border rounded-md"
                  {...register("byLocation")}
                  defaultValue={
                    type === "edit"
                      ? editData?.contractorSegment?.byLocation
                      : ""
                  }
                >
                  <option value="" className="cursor-not-allowed">
                    -- Select Location --
                  </option>

                  {contractorSecments?.byLocation?.map(
                    (item: any, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              )}
            </Column>
            <Column>
              <Label htmlFor="stage">By Onboarding stage:</Label>
              {type === "push" ? (
                <SegmentsSelection
                  segments={contractorSecments?.byOnboardingStage}
                  open={"byOnboardingStage"}
                  type="contractors"
                  selectSegment={selectSegment}
                  selectedSegments={pushSegmentsContractors?.byOnboardingStage}
                />
              ) : (
                <select
                  id="byOnboardingStage"
                  className="h-12 px-2 border-gray-700 border rounded-md"
                  {...register("byOnboardingStage")}
                  defaultValue={
                    type === "edit"
                      ? editData?.contractorSegment?.byOnboardingStage
                      : ""
                  }
                >
                  <option value="" className="cursor-not-allowed">
                    {" "}
                    -- Select Stage --{" "}
                  </option>

                  {contractorSecments?.byOnboardingStage?.map(
                    (item: any, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              )}
            </Column>

            <Column>
              <Label htmlFor="byStatus">By Status:</Label>
              {type === "push" ? (
                <SegmentsSelection
                  segments={contractorSecments?.byStatus}
                  open={"byStatus"}
                  type="contractors"
                  selectSegment={selectSegment}
                  selectedSegments={pushSegmentsContractors?.byStatus}
                />
              ) : (
                <select
                  id="byStatus"
                  className="h-12 px-2 border-gray-700 border rounded-md"
                  {...register("byStatus")}
                  defaultValue={
                    type === "edit" ? editData?.contractorSegment?.byStatus : ""
                  }
                >
                  <option value="" className="cursor-not-allowed">
                    {" "}
                    -- Select status --{" "}
                  </option>

                  {contractorSecments?.byStatus?.map(
                    (item: any, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              )}
            </Column>
            <Column>
              <Label htmlFor="referal">By Rating:</Label>
              <select
                id="byRating"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("byRating")}
                defaultValue={
                  type === "edit" ? editData?.contractorSegment?.byRating : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  -- Select Rating --
                </option>

                {contractorSecments?.byRating?.map(
                  (item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </Column>
            <Column>
              <Label htmlFor="bySkills">By Skills:</Label>
              {type === "push" ? (
                <SegmentsSelection
                  segments={contractorSecments?.bySkills}
                  open={"bySkills"}
                  type="contractors"
                  selectSegment={selectSegment}
                  selectedSegments={pushSegmentsContractors?.bySkills}
                />
              ) : (
                <select
                  id="bySkills"
                  className="h-12 px-2 border-gray-700 border rounded-md"
                  {...register("bySkills")}
                  defaultValue={
                    type === "edit" ? editData?.contractorSegment?.bySkills : ""
                  }
                >
                  <option value="" className="cursor-not-allowed">
                    {" "}
                    -- Select skills --{" "}
                  </option>

                  {contractorSecments?.bySkills?.map(
                    (item: any, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              )}
            </Column>
            <Column>
              <Label htmlFor="byReferral">By Referral:</Label>
              <select
                id="byReferral"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("byReferral")}
                defaultValue={
                  type === "edit" ? editData?.contractorSegment?.byReferral : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  -- Select by Referral --
                </option>

                {contractorSecments?.byReferral?.map(
                  (item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </Column>
            <Column>
              <Label htmlFor="createdAfter">CreatedAfter:</Label>
              <select
                id="createdAfter"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("createdAfter")}
                defaultValue={
                  type === "edit"
                    ? editData?.contractorSegment?.createdAfter
                    : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  -- Select createdAfter --
                </option>

                {contractorSecments?.createdAfter?.map(
                  (item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </Column>
            <Column>
              <Label htmlFor="createdBefore">CreatedBefore:</Label>
              <select
                id="createdBefore"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("createdBefore")}
                defaultValue={
                  type === "edit"
                    ? editData?.contractorSegment?.createdBefore
                    : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  {" "}
                  -- Select createdBefore --{" "}
                </option>

                {contractorSecments?.createdBefore?.map(
                  (item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </Column>
            <Column>
              <Label htmlFor="noBackgroundCheck">No Background Check:</Label>
              <select
                id="noBackgroundCheck"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("noBackgroundCheck")}
                defaultValue={
                  type === "edit"
                    ? editData?.contractorSegment?.noBackgroundCheck
                    : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  {" "}
                  -- Select Background Check --{" "}
                </option>

                {contractorSecments?.noBackgroundCheck?.map(
                  (item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </Column>
            <Column>
              <Label htmlFor="noProfile_After_Hours">
                No Profile After Hours:
              </Label>
              <select
                id="noProfile_After_Hours"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("noProfile_After_Hours")}
                defaultValue={
                  type === "edit"
                    ? editData?.contractorSegment?.noProfile_After_Hours
                    : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  {" "}
                  -- Select Hour Mark --{" "}
                </option>

                {contractorSecments?.noProfile_After_Hours?.map(
                  (item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </Column>
            <div></div>
          </div>
        </>
      ) : null}

      {segment === "All" || segment === "Customers" ? (
        <>
          <h2
            className="text-[16px] font-semibold
          my-4"
          >
            Customers Segments (optional)
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <Column>
              <Label htmlFor="Location">By Location:</Label>
              {type === "push" ? (
                <SegmentsSelection
                  segments={customerSecments?.byLocation}
                  open={"byLocation"}
                  type="customers"
                  selectSegment={selectSegment}
                  selectedSegments={pushSegmentsCustomers?.byLocation}
                />
              ) : (
                // customerSecments?.byLocation?.map((acc: any, i: number) => (
                //   <span
                //     className="flex gap-3 items-center cursor-pointer"
                //     key={i}
                //     onClick={() =>
                //       selectSegment("byLocation", "customers", acc)
                //     }
                //   >
                //     <CheckBox
                //       isChecked={pushSegmentsCustomers?.byLocation?.some(
                //         (data: any) => data === acc
                //       )}
                //       onClick={() => {}}
                //     />
                //     <span
                //       className={`${
                //         pushSegmentsCustomers?.byLocation?.some(
                //           (data: any) => data === acc
                //         )
                //           ? "text-gray-800"
                //           : "text-gray-400"
                //       }`}
                //     >
                //       {acc}
                //     </span>
                //   </span>
                // ))
                <select
                  id="byLocationc"
                  className="h-12 px-2 border-gray-700 border rounded-md"
                  {...register("byLocationc")}
                  defaultValue={
                    type === "edit" ? editData?.customerSegment?.byLocation : ""
                  }
                >
                  <option value="" className="cursor-not-allowed">
                    -- Select Location --
                  </option>

                  {customerSecments?.byLocation?.map(
                    (item: any, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              )}
            </Column>
            <Column>
              <Label htmlFor="byStatus">By Status:</Label>
              {type === "push" ? (
                <SegmentsSelection
                  segments={customerSecments?.byStatus}
                  open={"byStatus"}
                  type="customers"
                  selectSegment={selectSegment}
                  selectedSegments={pushSegmentsCustomers?.byStatus}
                />
              ) : (
                <select
                  id="byStatus"
                  className="h-12 px-2 border-gray-700 border rounded-md"
                  {...register("byStatusc")}
                  defaultValue={
                    type === "edit" ? editData?.customerSegment?.byStatus : ""
                  }
                >
                  <option value="" className="cursor-not-allowed">
                    {" "}
                    -- Select status --{" "}
                  </option>

                  {customerSecments?.byStatus?.map(
                    (item: any, index: number) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  )}
                </select>
              )}
            </Column>
            <Column>
              <Label htmlFor="referal">By Rating:</Label>
              <select
                id="byRating"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("byRatingc")}
                defaultValue={
                  type === "edit" ? editData?.customerSegment?.byRating : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  -- Select Rating --
                </option>

                {customerSecments?.byRating?.map((item: any, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Column>
            <Column>
              <Label htmlFor="byReferral">By Referral:</Label>
              <select
                id="byReferral"
                className="h-12 px-2 border-gray-700 border rounded-md"
                {...register("byReferralc")}
                defaultValue={
                  type === "edit" ? editData?.customerSegment?.byReferral : ""
                }
              >
                <option value="" className="cursor-not-allowed">
                  -- Select by Referral --
                </option>

                {customerSecments?.byReferral?.map(
                  (item: any, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </Column>
          </div>
        </>
      ) : null}

      <SubmitBtn
        className="flex justify-center items-center text-center"
        onClick={handleSubmit(onSubmit)}
      >
        {type === "new"
          ? "Create Campaign"
          : type === "push"
          ? "Send Notification"
          : "Update Campaign"}
      </SubmitBtn>
    </div>
  );
};

export default Form;

type Iopen =
  | "byLocation"
  | "byRating"
  | "byStatus"
  | "byReferral"
  | "byAccountType"
  | "byLocation"
  | "byOnboardingStage"
  | "byRating"
  | "byReferral"
  | "bySkills"
  | "byStatus"
  | "createdAfter"
  | "createdBefore"
  | "noBackgroundCheck"
  | "noProfile_After_Hours"
  | "";

type TypeType = "contractors" | "customers";
const SegmentsSelection = ({
  selectedSegments,
  segments,
  open,
  selectSegment,
  type,
}: {
  selectedSegments: string[];
  segments: string[];
  open: Iopen;
  selectSegment: any;
  type: TypeType;
}) => {
  const [modalString, setModalString] = useState<Iopen>("");
  const [myType, setMytype] = useState<TypeType>();

  useEffect(() => {
    setMytype(type);
  }, [type]);
  // console.log(modalString, open);

  return (
    <div className="relative">
      <button
        className="px-2 border-gray-700 border rounded-md py-3 text-sm w-full"
        onClick={() => setModalString((item) => (item ? "" : open))}
      >
        {`${
          selectedSegments.length === 1
            ? selectedSegments[0]
            : selectedSegments.length > 1
            ? `${selectedSegments[0]} & ${selectedSegments?.length - 1} others`
            : `-- Select ${open} --`
        } `}
      </button>

      {type === myType && open === modalString ? (
        <div className="absolute z-50 py-2 px-2 max-h-[200px] overflow-y-auto bg-white rounded-md shadow-xl w-full top-[32px]">
          {[...segments].map((acc: any, i: number) => (
            <span
              className="flex gap-3 items-center cursor-pointer"
              key={i}
              onClick={() => selectSegment(open, type, acc)}
            >
              <CheckBox
                isChecked={selectedSegments?.some((data: any) => data === acc)}
                onClick={() => {}}
              />
              <span
                className={`${
                  selectedSegments?.some((data: any) => data === acc)
                    ? "text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {acc}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
};
