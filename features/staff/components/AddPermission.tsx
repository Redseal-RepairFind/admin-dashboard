import React from "react";
import { useForm } from "react-hook-form";
import useStaff from "@/lib/hooks/useStaff";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/ui/submit-btn";

const AddPermission = ({ hideModal }: { hideModal: any }) => {
  const { AddNewPermission, refetchPermissionList } = useStaff();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (payload: any) => {
    try {
      const data = await AddNewPermission(payload);
      // console.log(data);
      toast.success(data?.message);
      setTimeout(() => {
        refetchPermissionList();
        hideModal();
      }, 1000);
    } catch (e: any) {
      // console.log(e);
      toast.error(e?.response?.data?.message);
    }

    // console.log(payload);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto p-4 bg-white rounded-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Permission Title
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: true })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          />
        </div>

        <div className="flex items-center justify-between">
          <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default AddPermission;
