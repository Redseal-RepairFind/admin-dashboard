import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useStaff from "@/lib/hooks/useStaff";
import toast from "react-hot-toast";
import PasswordField from "@/components/ui/password-input";
import SubmitBtn from "@/components/ui/submit-btn";

const AddStaff = ({ setOpen }: { setOpen: any }) => {
  const { permissionList, AddStaff: InviteUser, refetchStaffData } = useStaff();

  const [selectedPermissions, setSelectedPermissions] = useState<any>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  // console.log(permissionList);

  const onSubmit = async (data: any) => {
    if (!selectedPermissions.length)
      return toast.error("Kindly add permissions");

    const payload = { ...data, permisions: selectedPermissions };

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

  const addPermission = (permissionId: any) => {
    if (!selectedPermissions.includes(permissionId)) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const removePermission = (permissionId: string) => {
    setSelectedPermissions(
      selectedPermissions.filter((id: string) => id !== permissionId)
    );
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

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Permissions
          </label>
          <ul className="list-disc h-[200px] overflow-y-scroll p-5 border border-gray-200 rounded-md">
            {permissionList?.map((permission: any) => (
              <li
                key={permission._id}
                className="flex justify-between mb-1 items-center"
              >
                <span className="border capitalize pl-3 border-gray-100 bg-gray-100 flex-1 py-1.5 rounded-md">
                  {permission.name}
                </span>
                <button
                  type="button"
                  onClick={() => addPermission(permission._id)}
                  className="ml-2 bg-black hover:bg-gray-700 text-sm text-white font-bold py-2 px-5 duration-200 rounded focus:outline-none focus:shadow-outline"
                  disabled={selectedPermissions.includes(permission._id)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Selected Permissions
          </label>
          <ul className="list-disc">
            {selectedPermissions.map((permissionId: string, index: number) => {
              const permission = permissionList?.find(
                (p: any) => p._id === permissionId
              );
              return (
                <li
                  key={permissionId}
                  className="flex justify-between mb-1 items-center"
                >
                  <span className="capitalize">
                    {index + 1}. {permission.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePermission(permissionId)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
