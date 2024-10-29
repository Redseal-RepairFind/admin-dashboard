"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { usePromotion } from "@/lib/hooks/usePromotion";

type FormData = {
  name: string;
  code: string;
  startDate: string;
  target: string;
  criteria: string;
  value: string;
  valueType: string;
  description: string;
  status: string;
  contractorLimit: string;
  customerLimit: string;
};

function PromotionForm({ close }: { close: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    code: "",
    startDate: "",
    target: "",
    criteria: "",
    value: "",
    valueType: "",
    description: "",
    status: "",
    contractorLimit: "",
    customerLimit: "",
  });

  const { formState, register, handleSubmit } = useForm();

  const { refetchPromo, CreatePromo } = usePromotion();

  const { errors } = formState;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  async function onSubmit(formData: any) {
    toast.loading("Processing...");

    const mainData = {
      name: formData.name,
      code: formData.code?.toUpperCase(),
      startDate: formData.startDate.replace("/", "-"),
      target: formData.target?.toUpperCase(),
      criteria: formData.criteria,
      value: +formData.value,
      valueType: formData.valueType.toUpperCase(),
      description: formData.description,
      status: formData.status.toUpperCase(),
      contractorLimit: +formData.contractorLimit,
      customerLimit: +formData.customerLimit,
    };
    // console.log(mainData);

    try {
      const data: any = await CreatePromo(mainData);
      toast.remove();
      toast.success(data?.message);
      close?.();
      setTimeout(() => {
        refetchPromo();
      }, 1000);
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data?.errors[0]?.msg);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 min-w-[600px] overflow-y-auto mt-6"
    >
      <Column>
        <Row>
          <label>Name:</label>
          <input
            type="text"
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            placeholder="Promotion name"
            {...register("name", {
              required: "The promo name is required",
            })}
          />
          {errors?.name ? (
            <p className="text-red-700">{errors?.name?.message?.toString()}</p>
          ) : null}
        </Row>

        <Row>
          <label>Code:</label>
          <input
            type="text"
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("code", {
              required: "The promo code name is required",
            })}
          />
          {errors?.code ? (
            <p className="text-red-700">{errors?.code?.message?.toString()}</p>
          ) : null}
        </Row>
      </Column>

      <Column>
        <Row>
          <label>Start Date:</label>
          <input
            type="date"
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("startDate", {
              required: "The Start date is required",
            })}
          />
          {errors?.startDate ? (
            <p className="text-red-700">
              {errors?.startDate?.message?.toString()}
            </p>
          ) : null}{" "}
        </Row>
        <Row>
          <label>Target:</label>
          <input
            type="text"
            // name="target"
            // onChange={handleInputChange}
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("target", {
              required: "The promo Target field is required",
            })}
          />
          {errors?.target ? (
            <p className="text-red-700">
              {errors?.target?.message?.toString()}
            </p>
          ) : null}{" "}
        </Row>
      </Column>
      <Column>
        <Row>
          <label>Criteria:</label>
          <input
            type="text"
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("criteria", {
              required: "The criteria field is required",
            })}
          />
          {errors?.criteria ? (
            <p className="text-red-700">
              {errors?.criteria?.message?.toString()}
            </p>
          ) : null}
        </Row>
        <Row>
          <label>Value:</label>
          <input
            type="number"
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("value", {
              required: "The discount field is required",
            })}
          />
          {errors?.value ? (
            <p className="text-red-700">{errors?.value?.message?.toString()}</p>
          ) : null}{" "}
        </Row>
      </Column>

      <label>Description:</label>
      <textarea
        className="border border-gray-800 rounded-md h-12 ring-0 px-2"
        {...register("description", {
          required: "The description field is required",
        })}
        // rows={5}
      ></textarea>

      {errors?.description ? (
        <p className="text-red-700">
          {errors?.description?.message?.toString()}
        </p>
      ) : null}
      <Column>
        <Row>
          <label>Value Type:</label>
          <select
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("valueType", {
              required: "The promo dscount type is required",
            })}
          >
            <option value="fixed">Fixed</option>
            <option value="percentage">Percentage</option>
          </select>
          {errors?.valueType ? (
            <p className="text-red-700">
              {errors?.valueType?.message?.toString()}
            </p>
          ) : null}{" "}
          <option value="">Select Value Type</option>
        </Row>

        <Row>
          <label>Status:</label>
          <select
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("status", {
              required: "The promo status is required",
            })}
          >
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            {/* <option value="SUSPENDED">Suspended</option> */}
          </select>
          {errors?.status ? (
            <p className="text-red-700">
              {errors?.status?.message?.toString()}
            </p>
          ) : null}
        </Row>
      </Column>

      <Column>
        <Row>
          <label>Contractor Limit:</label>
          <input
            type="number"
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("contractorLimit", {
              required: "The Contractor's Limit is required",
            })}
          />
          {errors?.contractornameLimit ? (
            <p className="text-red-700">
              {errors?.contractorLimit?.message?.toString()}
            </p>
          ) : null}
        </Row>
        <Row>
          <label>Customer Limit:</label>
          <input
            type="number"
            // name="customerLimit"
            // onChange={handleInputChange}
            className="border border-gray-800 rounded-md h-12 ring-0 px-2"
            {...register("customerLimit", {
              required: "The Customer's Limit is required",
            })}
          />
          {errors?.customerLimit ? (
            <p className="text-red-700">
              {errors?.customerLimit?.message?.toString()}
            </p>
          ) : null}
        </Row>
      </Column>

      <button type="submit" className="bg-black text-white p-2 rounded-md">
        Submit
      </button>
    </form>
  );
}

export default PromotionForm;

function Column({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 ">{children}</div>;
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
