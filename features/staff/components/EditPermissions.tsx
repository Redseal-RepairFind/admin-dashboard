import React, { useState } from "react";
import useStaff from "@/lib/hooks/useStaff";
import toast from "react-hot-toast";
import CustomDropdown from "@/components/shared/custom-dropdown";
import { useForm } from "react-hook-form";
import SubmitBtn from "@/components/ui/submit-btn";

interface Permission {
  value: string;
  label: string;
}

const EditPermissions = ({
  currentStaff,
  hideModal,
  refetch,
}: {
  currentStaff: any;
  hideModal: any;
  refetch: any;
}) => {
  const { permissionList, UpdatePermission } = useStaff();

  const selectedPermissions = currentStaff?.permissions?.map(
    (permission: any) => {
      return { value: permission?._id, label: permission?.name };
    }
  );

  const [defaultPermissions, setDefaultPermissions] = useState<Permission[]>(
    selectedPermissions || []
  );

  // console.log(currentStaff, selectedPermissions);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    const payload = {
      staffId: currentStaff?._id,
      permissions: defaultPermissions.map((permission) => permission.value),
    };

    // console.log(payload);

    try {
      const data = await UpdatePermission(payload);
      // console.log(data);
      toast.success(data?.message);
      setTimeout(() => {
        refetch();
        hideModal();
      }, 1000);
    } catch (e: any) {
      console.log(e);
      toast.error(e?.response?.data?.message);
    }
  };

  const handleSelected = (selected: Permission[]) => {
    if (selected.length < defaultPermissions.length) {
      setDefaultPermissions(selected);
      return;
    }

    const updatedPermissions = [...defaultPermissions];

    selected.forEach((item: Permission) => {
      if (!updatedPermissions.some((perm) => perm.value === item.value)) {
        updatedPermissions.push(item);
      }
    });

    setDefaultPermissions(updatedPermissions);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <div className="mb-4 h-[400px] p-4 overflow-y-scroll">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Edit Permissions
          </label>
          <CustomDropdown
            isMulti={true}
            width={"100%"}
            onChange={(selected: Permission[]) => handleSelected(selected)}
            value={defaultPermissions || []}
            options={permissionList?.map((permission: any) => {
              return { value: permission?._id, label: permission?.name };
            })}
            defaultValue={defaultPermissions}
            placeholder="Select permissions"
          />
        </div>

        <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
      </div>
    </form>
  );
};

export default EditPermissions;
