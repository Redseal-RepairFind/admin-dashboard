import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useStaff from "@/lib/hooks/useStaff";
import toast from "react-hot-toast";
import PasswordField from "@/components/ui/password-input";
import SubmitBtn from "@/components/ui/submit-btn";
import CustomDropdown from "@/components/shared/custom-dropdown";

interface Permission {
  value: string;
  label: string;
}

const AddStaff = ({ setOpen }: { setOpen: any }) => {
  const { permissionList, AddStaff: InviteUser, refetchStaffData } = useStaff();

  const [defaultPermissions, setDefaultPermissions] = useState<Permission[]>(
    []
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  // console.log(defaultPermissions);

  const onSubmit = async (data: any) => {
    if (!defaultPermissions.length)
      return toast.error("Kindly add permissions");

    const payload = {
      ...data,
      permisions: defaultPermissions.map((permission) => permission.value),
    };

    try {
      const data = await InviteUser(payload);
      console.log(data);
      toast.success(data?.message);
      setTimeout(() => {
        refetchStaffData();
        setOpen();
      }, 1000);
    } catch (e: any) {
      console.log(e);
      toast.error(e?.response?.data?.message);
    }

    // console.log(payload);
  };

  const handleSelected = (selected: Permission[]) => {
    // setIsFresh(false);

    if (selected.length < defaultPermissions.length) {
      return setDefaultPermissions(selected);
    }

    // Create a new array by combining elements from defaultPermissions and selected
    const updatedPermissions = [...defaultPermissions];

    selected.forEach((item: Permission) => {
      // Check if item is not already in updatedPermissions
      if (
        !updatedPermissions.some(
          (perm: Permission) => perm.value === item?.value
        )
      ) {
        updatedPermissions.push(item);
      }
    });

    setDefaultPermissions(updatedPermissions);
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
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName", { required: true })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName", { required: true })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          />
        </div>

        {/* <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <PasswordField
            {...register("password", {
              required: true,
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          />
        </div> */}

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            {...register("phoneNumber", {
              required: true,
            })}
            className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          />
        </div>

        <div className="mb-4 h-[200px]">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Permissions
          </label>
          <CustomDropdown
            isMulti={true}
            width={"100%"}
            onChange={(selected: Permission[]) => handleSelected(selected)}
            value={defaultPermissions || []}
            options={permissionList?.map((permission: any) => {
              return { value: permission?._id, label: permission?.name };
            })}
            defaultValue={[]}
            placeholder="Select permissions"
          />
        </div>

        <div className="flex items-center justify-between">
          <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
