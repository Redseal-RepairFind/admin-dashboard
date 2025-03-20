"use client";

import React, { useEffect, useState } from "react";
import useStaff from "@/lib/hooks/useStaff";
import toast from "react-hot-toast";
import CustomDropdown from "@/components/shared/custom-dropdown";
import { useForm } from "react-hook-form";
import SubmitBtn from "@/components/ui/submit-btn";
import { Header } from "@/features/quiz/components";
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

const EditPermissions = ({
  currentStaff,
  hideModal,
  refetch,
  type = "editPermission",
  handleEditPermission,
}: {
  currentStaff: any;
  hideModal: any;
  refetch: any;
  type?: "editTeams" | "editPermission" | "addPermissions";
  handleEditPermission?: any;
}) => {
  const {
    permissionList,
    UpdatePermission,
    teamsData,
    addStaffToTeam,
    refetchStaffData,
  } = useStaff();
  const [checkedList, setCheckedList] = useState<CheckedList>({
    teams: type.includes("editTeams") ? currentStaff : currentStaff?.teams,
    permissions: currentStaff?.permissions,
  });
  const selectedPermissions = checkedList?.permissions?.map(
    (permission: any) => {
      return { value: permission?._id, label: permission?.name };
    }
  );

  const [defaultPermissions, setDefaultPermissions] = useState<Permission[]>(
    selectedPermissions || []
  );

  // console.log(checkedList);
  useEffect(() => {
    if (type.includes("editPermission") || type.includes("addPermission")) {
      // Filter teams based on checkedList.teams
      const teams = teamsData?.filter((item: any) =>
        checkedList?.teams.some((team: any) => team?._id === item?._id)
      );

      // Extract permissions from the selected teams
      const teamsPerm = teams?.map((team: any) => team?.permissions);

      // Flatten the permissions array and ensure uniqueness
      const teamPermissions: any[] = [
        ...new Map(
          teamsPerm
            ?.flatMap((subArray: any) => subArray)
            .map((item: any) => [item?._id, item])
        ).values(),
      ];

      // Combine teamPermissions with checkedList.permissions and remove duplicates
      const combinedPermissions: any[] = [
        ...new Map(
          [...teamPermissions, ...checkedList.permissions].map((item: any) => [
            item?._id,
            item,
          ])
        ).values(),
      ];

      // Update the checkedList with the combined permissions
      setCheckedList({ ...checkedList, permissions: combinedPermissions });
    }
  }, [checkedList.teams, teamsData, type]);

  // console.log(permissionList.map((permission: any) => permission.name));

  const handleSelect = (type: "teams" | "permissions", item: any) => {
    setCheckedList((checked) => {
      const isAlreadySelected = checked[type].some(
        (selectedItem: any) => selectedItem._id === item._id
      );

      const updatedList = isAlreadySelected
        ? checked[type].filter(
            (selectedItem: any) => selectedItem._id !== item?._id
          ) // Remove the item if already selected
        : [...checked[type], item]; // Add the item if not selected

      return {
        ...checked,
        [type]: updatedList,
      };
    });
  };
  // console.log(currentStaff);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleAddStaffToTeam = async () => {
    toast.loading("Adding To team...");
    try {
      const payload = {
        staffId: currentStaff?._id,
        teams: checkedList?.teams?.map((team: any) => team?._id),
        permissions: checkedList?.permissions?.map(
          (permission: any) => permission?._id
        ),
      };

      // console.log(payload);

      const data = await addStaffToTeam(payload);
      toast.remove();
      // toast.success(data?.message || "User added to Team successfully");

      refetchStaffData();
      hideModal();
    } catch (error: any) {
      toast.remove();
      toast.error(error?.response?.data?.message || "Failed to add to team");
      console.error(error);
    }
  };

  const onSubmit = async (data: any) => {
    // const payload = {
    //   staffId: currentStaff?._id,
    //   permissions: defaultPermissions.map((permission) => permission.value),
    // };
    const payload = {
      staffId: currentStaff?._id,
      permissions: checkedList.permissions.map((permission) => permission._id),
    };

    const team = {
      id: currentStaff?._id,
      permissions: checkedList.permissions.map((permission) => permission.name),
    };
    // console.log(payload);

    try {
      let data;
      if (type === "editTeams") {
        data = await handleEditPermission(team);
      } else if (type === "editPermission") {
        data = await UpdatePermission(payload);
      } else {
        data = await handleAddStaffToTeam();

        console.log(data);
      }
      toast.success(data?.message || "Permission updated successfully");
      setTimeout(() => {
        refetch();
        hideModal();
      }, 1000);
    } catch (e: any) {
      console.log(e);
      toast.error(e?.response?.data?.message || "Permission update failed");
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
        <div className="mb-4 min-h-[400px] p-4 overflow-y-scroll">
          <div className="w-full flex flex-col gap-6 pb-8 border-b border-b-slate-600">
            {type.includes("addPermission") ? (
              <>
                <label className="block text-gray-700 text-xl font-bold mb-2">
                  Teams
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {teamsData?.map((team: any) => (
                    <span className="flex items-center gap-2" key={team?._id}>
                      <CheckBox
                        isChecked={
                          type.includes("editPermission") ||
                          type.includes("addPermission")
                            ? checkedList?.teams?.some(
                                (item: any) => item?._id === team?._id
                              )
                            : checkedList?.teams?.name.includes(team?.name)
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("teams", team);
                        }}
                      />
                      <p
                        className={`${
                          type.includes("editPermission") ||
                          type.includes("addPermission")
                            ? checkedList?.teams?.some(
                                (item: any) => item?._id === team?._id
                              )
                            : checkedList?.teams?.name.includes(team?.name)
                            ? "text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {team?.name}
                      </p>
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <label className="block text-gray-700 text-xl font-bold mb-2">
              {type.includes("addPermission")
                ? " Additional Permissions"
                : "Edit Permissions"}
            </label>

            <div className="grid grid-cols-3 gap-2 ">
              {permissionList.map((permission: FetchedPermissions) => (
                <span className="flex items-center gap-2" key={permission?._id}>
                  <CheckBox
                    isChecked={checkedList?.permissions?.some(
                      (item: any) => item?._id === permission?._id
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect("permissions", permission);
                    }}
                  />
                  <p
                    className={`${
                      checkedList?.permissions?.some(
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
          </div>
          {/* <CustomDropdown
            isMulti={true}
            width={"100%"}
            onChange={(selected: Permission[]) => handleSelected(selected)}
            value={defaultPermissions || []}
            options={permissionList?.map((permission: any) => {
              return { value: permission?._id, label: permission?.name };
            })}
            defaultValue={defaultPermissions}
            placeholder="Select permissions"
          /> */}
        </div>

        <SubmitBtn isSubmitting={isSubmitting}>Submit</SubmitBtn>
      </div>
    </form>
  );
};

export default EditPermissions;
