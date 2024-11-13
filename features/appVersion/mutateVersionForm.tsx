"use client";

import { useForm } from "react-hook-form";
import Heading from "../shared/table/components/table-heading";
import React from "react";

type MutateForm = {
  type: "edit" | "create";
  handleSubmit: any;
  formstate: boolean;
  id?: string;
  data?: any;
  closeModal: any;
};

function Form({
  type,
  handleSubmit,
  formstate,
  data,
  closeModal,
  id,
}: MutateForm) {
  const { formState, register, handleSubmit: submitFN } = useForm();

  const { errors } = formState;

  async function onSubmit(data: any) {
    type === "edit"
      ? await handleSubmit({ payload: data, id })
      : await handleSubmit(data);
    closeModal?.();
  }

  return (
    <form
      className="flex flex-col gap-6 px-4 w-[400px]"
      onSubmit={submitFN(onSubmit)}
    >
      {/* Form fields */}
      <Heading name={type === "create" ? "Create Version" : "Edit Version"} />
      <Column>
        <Label htmlFor="Version">Version Number</Label>
        <input
          type="text"
          className="border border-gray-700  rounded-md w-full h-12 px-2"
          placeholder="Version"
          {...register("version", {
            required: "Version Number Field is required",
            pattern: {
              value: /^\d+(\.\d+){1,2}$/,
              message: "Invalid version format. Use format like 1.0.12",
            },
          })}
          defaultValue={type === "edit" ? data?.version : ""}
        />
        {errors?.version?.message ? (
          <Errors>{errors?.version?.message}</Errors>
        ) : null}{" "}
      </Column>
      <Column>
        <Label htmlFor="Status">Status</Label>
        <select
          className="border border-gray-700  rounded-md w-full h-12 px-2"
          {...register("status", {
            required: "Status Field is required",
          })}
          defaultValue={type === "edit" ? data?.status : ""}
        >
          <option value="">-- Select Status --</option>
          <option value="alpha">Alpha</option>
          <option value="beta">Beta</option>
          <option value="stable">Stable</option>
        </select>
        {errors?.status?.message ? (
          <Errors>{errors?.status?.message}</Errors>
        ) : null}{" "}
      </Column>
      <Column>
        <Label htmlFor="Platform">Platform</Label>
        <select
          id="type"
          className="h-12 px-2 border-gray-700 border rounded-md"
          {...register("type", {
            required: "Please select the version type (Platform)",
          })}
          defaultValue={type === "edit" ? data?.type : ""}
        >
          <option value="">Select Platform</option>
          <option value="IOS">IOS</option>
          <option value="ANDROID">ANDROID</option>
        </select>
        {errors?.type?.message ? (
          <Errors>{errors?.type?.message}</Errors>
        ) : null}
      </Column>
      <Column>
        <Label htmlFor="App Name">App Name</Label>
        <select
          id="app"
          className="h-12 px-2 border-gray-700 border rounded-md"
          {...register("app", {
            required: "Please Select an app name",
          })}
          defaultValue={type === "edit" ? data?.app : ""}
        >
          <option value="">Select App</option>
          <option value="customer">Customer App</option>
          <option value="contractor">Contractor App</option>
        </select>
        {errors?.app?.message ? <Errors>{errors?.app?.message}</Errors> : null}{" "}
      </Column>

      <Column>
        <Label htmlFor="isCurrent">Is Current?</Label>
        <select
          id="isCurrent"
          className="h-12 px-2 border-gray-700 border rounded-md"
          {...register("isCurrent", {
            required: "Please choose the current status",
          })}
          defaultValue={type === "edit" ? data?.isCurrent : ""}
        >
          <option value="">-- Select Current --</option>
          <option value="true">True </option>
          <option value="false">False</option>
        </select>
        {errors?.isCurrent?.message ? (
          <Errors>{errors?.isCurrent?.message}</Errors>
        ) : null}
      </Column>

      <button
        className={`w-full h-12 border border-black rounded-md px-2 bg-black text-white`}
      >
        {type === "edit" ? "Update Version" : "Create Version"}
      </button>
      {/* Cancel button */}
    </form>
  );
}

export default Form;

function Column({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label htmlFor={htmlFor} className="font-semibold text-sm">
      {children}
    </label>
  );
}

function Errors({ children }: { children: any }) {
  return <p className="font-semibold text-[12px] text-red-600">{children}</p>;
}