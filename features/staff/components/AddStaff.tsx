import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useStaff from "@/lib/hooks/useStaff";
import toast from "react-hot-toast";
import PasswordField from "@/components/ui/password-input";
import SubmitBtn from "@/components/ui/submit-btn";
import CustomDropdown from "@/components/shared/custom-dropdown";
import CheckBox from "@/app/_components/Check-box";

interface Permission {
  value: string;
  label: string;
}

interface FetchedPermissions {
  name: string;
  _id: string;
  description: string;
  // createdAt?: string;
}

interface Teams {
  name: string;
  _id: string;
}

interface CheckedList {
  teams: Teams[] | any;
  permissions: FetchedPermissions[];
}

const AddStaff = ({ setOpen }: { setOpen: any }) => {
  const {
    permissionList,
    AddStaff: InviteUser,
    refetchStaffData,
    teamsData,
  } = useStaff();

  const [checkedList, setCheckedList] = useState<FetchedPermissions[]>([]);

  const [defaultPermissions, setDefaultPermissions] = useState<Permission[]>(
    []
  );

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleSelect = (item: any) => {
    const isAlreadySelected = checkedList?.some(
      (selectedItem: FetchedPermissions) => selectedItem._id === item._id
    );

    const updatedList = isAlreadySelected
      ? checkedList?.filter(
          (selectedItem: FetchedPermissions) => selectedItem._id !== item._id
        ) // Remove the item if it is already selected
      : [...checkedList, item]; // Add the item if it is not already selected

    setCheckedList(updatedList);

    // console.log(updatedList); // Log the updated list
  };

  // console.log(defaultPermissions);

  const onSubmit = async (data: any) => {
    if (!checkedList.length) return toast.error("Kindly add permissions");

    const payload = {
      ...data,
      permisions: checkedList.map((permission) => permission._id),
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

        {/* <div className="grid grid-cols-3 gap-2 ">
          {permissionList.map((permission: FetchedPermissions) => (
            <span className="flex items-center gap-2" key={permission?._id}>
              <CheckBox
                isChecked={
                  checkedList?.some(
                    (item: any) => item?._id === permission?._id
                  ) || false
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(permission);
                }}
              />
              <p
                className={`${
                  checkedList?.some(
                    (item: any) => item?._id === permission?._id
                  )
                    ? "text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {permission?.name}
              </p>
            </span>
          ))}
        </div> */}

        <AddPermissions
          defaultPermissions={checkedList}
          setDefaultPermissions={setCheckedList}
        />

        <div className="flex items-center justify-between">
          <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;

export function AddPermissions({
  defaultPermissions,
  setDefaultPermissions,
}: // handleSelect
{
  defaultPermissions: FetchedPermissions[];
  setDefaultPermissions: any;
  // handleSelect: (item: any) => void
}) {
  const { permissionList } = useStaff();
  const handleSelect = (item: any) => {
    const isAlreadySelected = defaultPermissions?.some(
      (selectedItem: FetchedPermissions) => selectedItem._id === item._id
    );

    const updatedList = isAlreadySelected
      ? defaultPermissions?.filter(
          (selectedItem: FetchedPermissions) => selectedItem._id !== item._id
        ) // Remove the item if it is already selected
      : [...defaultPermissions, item]; // Add the item if it is not already selected

    setDefaultPermissions(updatedList);

    // console.log(updatedList); // Log the updated list
  };

  return (
    <div className="mb-4 h-[200px]">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Permissions
      </label>
      <div className="grid grid-cols-3 gap-2 ">
        {permissionList.map((permission: FetchedPermissions) => (
          <span className="flex items-center gap-2" key={permission?._id}>
            <CheckBox
              isChecked={
                defaultPermissions?.some(
                  (item: any) => item?._id === permission?._id
                ) || false
              }
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(permission);
              }}
            />
            <p
              className={`${
                defaultPermissions?.some(
                  (item: any) => item?._id === permission?._id
                )
                  ? "text-gray-800"
                  : "text-gray-400"
              }`}
            >
              {permission?.name}
            </p>
          </span>
        ))}
      </div>
      {/* <CustomDropdown
        isMulti={true}
        width={"100%"}
        onChange={(selected: Permission[]) => handleSelected(selected)}
        value={defaultPermissions || []}
        options={permissionList?.map((permission: any) => {
          return { value: permission?._id, label: permission?.name };
        })}
        defaultValue={[]}
        placeholder="Select permissions"
      /> */}
    </div>
  );
}
