import React from "react";
import useEmergency from "@/lib/hooks/useEmergency";
import useDisputes from "@/lib/hooks/useDisputes";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/ui/submit-btn";

const SettleEmergency = ({
  id,
  setOpen,
  resolveType,
}: {
  id: any;
  setOpen: any;
  resolveType: any;
}) => {
  // console.log(emergencyID);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { SettleDispute, refetchDispute } = useDisputes();

  const handleSettle = async (payload: any) => {
    try {
      const response = await SettleDispute({ id, payload, type: resolveType });
      toast.remove();
      toast.success(response?.message);
      setTimeout(() => {
        setOpen();
        refetchDispute();
      }, 1000);
    } catch (e: any) {
      toast.remove();
      //   console.log({ e });
      toast.error(e?.response?.data?.message);
    }
  };

  return (
    <div className="md:w-[500px] mx-2 w-full mt-7">
      <form onSubmit={handleSubmit(handleSettle)} className="w-full">
        <div className="w-full">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            {resolveType === "customer"
              ? "Refund Customer - "
              : resolveType === "revisit"
              ? "Enable Revisit - "
              : "Pay Contractor - "}
            How was this resolved?
          </label>
          <div className="mt-1">
            <textarea
              rows={5}
              {...register("remark", {
                required: true,
              })}
              className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
            />
          </div>
        </div>
        <SubmitBtn isSubmitting={isSubmitting}>Proceed</SubmitBtn>
      </form>
    </div>
  );
};

export default SettleEmergency;
