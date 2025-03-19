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
  type?: "editTeams" | "editPermission";
  handleEditPermission?: any;
}) => {
  const { permissionList, UpdatePermission, teamsData } = useStaff();
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

  useEffect(() => {
    if (type.includes("editPermission")) {
      // userPermission = userPermission.map((team: any) => {
      const teams = teamsData?.filter((item: any) =>
        checkedList?.teams.some((team: any) => team?._id === item?._id)
      );
      const teamsPerm = teams?.map((team: any) => team?.permissions);

      const userPermission: any[] = [
        ...new Map(
          teamsPerm
            .flatMap((subArray: any) => subArray)
            .map((item: any) => [item?._id, item])
        ).values(),
      ];

      // });

      setCheckedList({ ...checkedList, permissions: userPermission });
      // console.log(userPermission);
    }
  }, [checkedList.teams, type, teamsData]);

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

    // console.log(checkedList);
  };

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    // const payload = {
    //   staffId: currentStaff?._id,
    //   permissions: defaultPermissions.map((permission) => permission.value),
    // };
    const payload = {
      staffId: currentStaff?._id,
      permissions: [
        "add_user",
        "view_customers",
        "update_customer",
        "crud_customer",
        "delete_customer",
        "read_contractor",
        "update_contractor",
        "delete_contractor",
        "crud_contractor",
        "read_emergency",
        "delete_emergency",
        "update_emergency",
        "crud_emergency",
        "delete_dispute",
        "update_dispute",
        "crud_dispute",
        "resolve_dispute",
        "read_dispute",
        "resolve_emergency",
        "crud_job",
        "enable_job_revisit",
        "create_transaction",
        "read_transaction",
        "delete_transaction",
        "create_payment",
        "delete_job",
        "crud_transaction",
        "update_job",
        "delete_payment",
        "update_transaction",
        "create_job",
        "update_payment",
        "read_job",
        "crud_payment",
        "read_payment",
        "read_customer",
        "manage_dispute",
        "add_promotion",
        "delete_promotion",
        "add_staff",
        "add_permission",
        "manage_staff",
        "update_permission",
        "manage_contractor_stripe",
        "delete_issues",
        "manage_coupon",
        "manage_app_version",
        "manage_staff_permission",
        "update_promotion",
        "manage_contractor_certn",
        "manage_issue",
        "manage_quiz",
        "delete_question",
        "update_question",
        "view_staff",
        "view_permission",
        "view_app_version",
        "view_question",
        "view_skills",
        "add_skills",
        "view_promotion",
        "delete_skills",
        "update_skills",
        "view_quiz",
        "tomiwa",
        "manage_disputes",
        "manage_permissions",
        "manage_app_versions",
        "manage_staffs",
        "manage_emergencies",
        "delete_contractors",
        "manage_contractors",
        "manage_customers",
        "manage_issues",
        "manage_promotions",
        "manage_skills",
        "manage_questions",
        "manage_quizzes",
      ],
    };

    const team = {
      id: currentStaff?._id,
      permissions: defaultPermissions.map((permission) => permission.label),
    };
    console.log(payload);

    try {
      let data;
      if (type === "editTeams") {
        data = await handleEditPermission(team);
      } else {
        data = await UpdatePermission(payload);
      }
      console.log(payload);
      toast.success(data?.message || "Permission updated successfully");
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
        <div className="mb-4 min-h-[400px] p-4 overflow-y-scroll">
          <div className="w-full flex flex-col gap-6 pb-8 border-b border-b-slate-600">
            <label className="block text-gray-700 text-xl font-bold mb-2">
              Teams
            </label>
            <div className="grid grid-cols-4 gap-4">
              {teamsData?.map((team: any) => (
                <span className="flex items-center gap-2" key={team?._id}>
                  <CheckBox
                    isChecked={
                      type.includes("editPermission")
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
                      type.includes("editPermission")
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
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <label className="block text-gray-700 text-xl font-bold mb-2">
              Additional Permissions
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
