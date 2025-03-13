import { useForm } from "react-hook-form";
import { AddPermissions } from "./AddStaff";
import SubmitBtn from "@/components/ui/submit-btn";
import { useState } from "react";
import toast from "react-hot-toast";
interface Permission {
  value: string;
  label: string;
}

function AddTeams({ setOpenTeamsForm }: { setOpenTeamsForm: any }) {
  const [defaultPermissions, setDefaultPermissions] = useState<Permission[]>(
    []
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!defaultPermissions.length)
      return toast.error("Kindly add permissions");

    const payload = {
      ...data,
      permisions: defaultPermissions.map((permission) => permission.label),
    };
    console.log(payload);
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
          />
        </div>

        <AddPermissions
          defaultPermissions={defaultPermissions}
          setDefaultPermissions={setDefaultPermissions}
        />

        <div className="flex items-center justify-between">
          <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
        </div>
      </form>
    </div>
  );
}

export default AddTeams;
