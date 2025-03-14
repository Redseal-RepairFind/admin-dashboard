import { useForm } from "react-hook-form";
import SubmitBtn from "@/components/ui/submit-btn";
import { useState } from "react";
import toast from "react-hot-toast";
import { AddPermissions } from "@/features/staff/components/AddStaff";
import EditPermissions from "@/features/staff/components/EditPermissions";
interface Permission {
  value: string;
  label: string;
}

function AddTeams({
  onHandleSubmit,
  type = "create",
  editData,
  close,
  refetch,
}: {
  onHandleSubmit: any;
  type: "create" | "edit";
  editData?: any;
  close: any;
  refetch: any;
}) {
  const [defaultPermissions, setDefaultPermissions] = useState(
    type === "edit" ? editData.permissions : []
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  let payload;
  const onSubmit = async (data: any) => {
    if (type === "create") {
      if (!defaultPermissions.length)
        return toast.error("Kindly add permissions");

      payload = {
        ...data,
        permissions: defaultPermissions.map(
          (permission: any) => permission.label
        ),
      };
      await onHandleSubmit(payload);
      close();
      refetch();
    } else if (type === "edit") {
      payload = {
        ...data,
      };

      const editPayload = {
        ...payload,
        id: editData?._id,
      };
      await onHandleSubmit(editPayload);
      close();
      refetch();
    }
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
            Team Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "The Team name is required" })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
            defaultValue={type === "edit" ? editData?.name : ""}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Team Description
          </label>
          <textarea
            id="lastName"
            rows={4}
            cols={4}
            {...register("description", {
              required: "Describe the teams function",
            })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
            defaultValue={type === "edit" ? editData?.description : ""}
          />
        </div>
        {type === "create" ? (
          <AddPermissions
            defaultPermissions={defaultPermissions}
            setDefaultPermissions={setDefaultPermissions}
          />
        ) : null}

        <div className="flex items-center justify-between">
          <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
        </div>
      </form>
    </div>
  );
}

export default AddTeams;
