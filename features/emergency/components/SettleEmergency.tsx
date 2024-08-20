import React from "react";
import useEmergency from "@/lib/hooks/useEmergency";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/ui/submit-btn";
import { useRouter } from "next/navigation";

const SettleEmergency = ({
  emergencyID,
  setOpen,
}: {
  emergencyID: any;
  setOpen: any;
}) => {
  // console.log(emergencyID);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const { ResolveEmergency, refetch } = useEmergency();

  const handleSettle = async (payload: any) => {
    // const payload = { ...values, emergencyId: emergencyID };
    try {
      const response = await ResolveEmergency({ id: emergencyID, payload });
      toast.remove();
      toast.success(response?.message);
      setTimeout(() => {
        setOpen();
        refetch();
        router.push("/emergency");
      }, 1000);
    } catch (e: any) {
      toast.remove();
      toast.error(e?.response?.data?.message);
      // console.log({ e });
    }
  };

  return (
    <div className="md:w-[500px] mx-2 w-full mt-7">
      <form onSubmit={handleSubmit(handleSettle)} className="w-full">
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            How was this resolved?
          </label>
          <div className="mt-1">
            <textarea
              rows={5}
              {...register("resolvedWay", {
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
