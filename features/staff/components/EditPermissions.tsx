import React, { useState } from "react";
import useStaff from "@/lib/hooks/useStaff";
import toast from "react-hot-toast";

const EditPermissions = ({ currentStaff }: { currentStaff: any }) => {
  const {
    permissionList,
    AddStaff: InviteUser,
    AddPermission,
    RemovePermission,
  } = useStaff();

  const [selectedPermissions, setSelectedPermissions] = useState<any>(
    currentStaff?.permissions || []
  );

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

  console.log(currentStaff, "edit");

  const handleAdd = (permissionId: string) => {
    const payload = { staffId: currentStaff?._id, permision: permissionId };

    return async () => {
      toast.loading("Processing...");
      try {
        const data = await AddPermission(payload);
        toast.remove();
        toast.success(data?.message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (e: any) {
        console.log(e);
        toast.remove();
        toast.error(e?.response?.data?.message);
      }
    };
  };

  const handleRemove = (permissionId: string) => {
    const payload = { staffId: currentStaff?._id, permision: permissionId };

    return async () => {
      toast.loading("Processing...");
      try {
        const data = await RemovePermission(payload);
        toast.remove();
        toast.success(data?.message);
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (e: any) {
        console.log(e);
        toast.remove();
        toast.error(e?.response?.data?.message);
      }
    };
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          All Permissions
        </label>
        <ul className="list-disc">
          {permissionList.map((permission: any) => (
            <li
              key={permission._id}
              className="flex justify-between mb-1 items-center"
            >
              <span className="border capitalize pl-3 border-gray-100 bg-gray-100 flex-1 py-1.5 rounded-md">
                {permission.name}
              </span>
              <button
                type="button"
                onClick={handleAdd(permission._id)}
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
          {`User's Permissions`}
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
                  onClick={handleRemove(permissionId)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn> */}
    </div>
  );
};

export default EditPermissions;
