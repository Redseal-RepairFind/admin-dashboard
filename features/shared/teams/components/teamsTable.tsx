"use client";
import React, { useEffect, useState, useRef } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import useStaff from "@/lib/hooks/useStaff";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import VerticalMenu from "@/components/shared/vertical-menu";

import toast from "react-hot-toast";
import { CompletedState, PendingState, SuspendedState } from "@/public/svg";
import Search from "@/components/shared/search";
import Pagination from "@/components/shared/pagination";
import { ScaleLoader } from "react-spinners";
import AddTeams from "@/features/shared/teams/components/AddTeams";
import EditPermissions from "@/features/staff/components/EditPermissions";
import DeleteModal from "@/features/customise/components/promotions/DeleteModal";
import Heading from "../../table/components/table-heading";
import { describe } from "node:test";

const table_headings = ["Team Name", "Description", "Action"];
function TeamsTable() {
  const [open, setOpen] = useState(false);
  const [openTeamsForm, setOpenTeamsForm] = useState({
    editInfo: false,
    delete: false,
    addTeam: false,
    editPermissions: false,
  });

  const [item, setItem] = useState<any>();

  const {
    teamsData,
    isLoadingTeams,
    refetchTeams,
    createTeam,
    editTeamInfo,
    editTeamPermission,
    deleteTeam,
  } = useStaff();

  const modalRef = useRef(null);

  const handleCreateTeam = async (team: any) => {
    toast.loading("Creating Team...");
    try {
      const data = await createTeam(team);

      toast.remove();
      toast.success(data?.message || " Team Created Successfully");
    } catch (error: any) {
      toast.remove();

      toast.error(error?.response?.data?.message || "Team creation failed");
      console.error(error);
    }
  };

  const handleCreateEdit = async (team: any) => {
    const id = team?.id;
    const payload = {
      permissions: team.permissions,
    };
    toast.loading("Editing Team...");
    try {
      const data = await editTeamPermission({ id, payload });

      toast.remove();
      refetchTeams();

      // toast.success(data?.message || " Team Edited Successfully");
    } catch (error: any) {
      toast.remove();

      toast.error(error?.response?.data?.message || "Team Editing failed");
      console.error(error);
    }
  };

  const handleEdit = async (team: any) => {
    console.log(team);

    const id = team?.id;
    const payload = {
      name: team.name,
      description: team.description,
    };

    toast.loading("Editing Team...");
    try {
      const data = await editTeamInfo({ id, payload });

      toast.remove();
      refetchTeams();

      toast.success(data?.message || " Team Edited Successfully");
    } catch (error: any) {
      toast.remove();

      toast.error(error?.response?.data?.message || "Team Editing failed");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    toast.loading("Deleting Team...");
    try {
      const data = await deleteTeam(item?._id);

      toast.remove();
      toast.success(data?.message || " Team Deleted Successfully");
      setOpenTeamsForm({ ...openTeamsForm, delete: false });

      refetchTeams();
    } catch (error: any) {
      toast.remove();

      toast.error(error?.response?.data?.message || "Team Deletion failed");
      console.error(error);
    }
  };

  let rowOptions = [
    {
      name: "Edit Team Permissions",
      action: (item: any) => {
        setOpenTeamsForm({ ...openTeamsForm, editPermissions: true });
        setItem(item);
      },
    },
    {
      name: "Edit Team Info",
      action: (item: any) => {
        setOpenTeamsForm({ ...openTeamsForm, editInfo: true });
        setItem(item);
      },
    },
    {
      name: "Delete Team",
      action: (item: any) => {
        setItem(item);

        setOpenTeamsForm({ ...openTeamsForm, delete: true });
      },
    },
  ];

  // const singleData = (id: string) => {
  //   return teamsData?.find((item: any) => item.id === id);
  // };
  return (
    <TableCard>
      <div className="flex items-center justify-between w-full -z-50">
        {/* <Heading name="Staff list" /> */}
        <div className="flex gap-8">
          {/* <Search
            search={search}
            setSearch={handleSearch}
            placeholder="Search..."
            setIsQuerying={setIsQuerying}
          /> */}
        </div>
        <div className="flex items-center justify-end gap-4">
          {/* <button
            onClick={() => setOpenPAdd(true)}
            className="border border-[#262626] py-2.5 px-5 rounded-md"
          >
            Add Permission
          </button>
          <button
            onClick={() => setOpen(true)}
            className="border border-[#262626] bg-[#262626] text-white py-2.5 px-5 rounded-md"
          >
            Create Employee
          </button> */}

          <button
            onClick={() =>
              setOpenTeamsForm({ ...openTeamsForm, addTeam: true })
            }
            className="border border-[#262626] bg-[#262626] text-white py-2.5 px-5 rounded-md"
          >
            Add New Team
          </button>
        </div>
      </div>

      <Modal
        open={openTeamsForm.addTeam}
        onClose={() => setOpenTeamsForm({ ...openTeamsForm, addTeam: false })}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] pt-6">
          <AddTeams
            type="create"
            onHandleSubmit={handleCreateTeam}
            close={() => setOpenTeamsForm({ ...openTeamsForm, addTeam: false })}
            refetch={refetchTeams}
          />
        </div>
      </Modal>

      <Modal
        open={openTeamsForm.editInfo}
        onClose={() => setOpenTeamsForm({ ...openTeamsForm, editInfo: false })}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] pt-6">
          <AddTeams
            type="edit"
            onHandleSubmit={handleEdit}
            editData={item}
            close={() =>
              setOpenTeamsForm({ ...openTeamsForm, editInfo: false })
            }
            refetch={refetchTeams}
          />
        </div>
      </Modal>

      <Modal
        open={openTeamsForm.editPermissions}
        onClose={() =>
          setOpenTeamsForm({ ...openTeamsForm, editPermissions: false })
        }
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] pt-6">
          <EditPermissions
            refetch={() => {}}
            hideModal={() =>
              setOpenTeamsForm({
                ...openTeamsForm,
                editPermissions: false,
              })
            }
            currentStaff={item}
            type="editTeams"
            handleEditPermission={handleCreateEdit}
          />
        </div>
      </Modal>
      <Modal
        open={openTeamsForm.delete}
        onClose={() => setOpenTeamsForm({ ...openTeamsForm, delete: false })}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="flex flex-col   gap-4 max-w-[480px] mx-auto">
          <div className="flex items-center justify-center">
            <Heading name={"Delete Team"} />
          </div>
          {/* Confirmation for delete */}
          <p className="text-center">
            Are you sure you want to delete {item?.name || ""} Team? This action
            cannot be undone.
          </p>

          <div className="grid grid-cols-2 gap-2 items-center gap">
            <button
              className="bg-gray-200 h-12 w-full flex items-center rounded-md justify-center text-gray-800"
              onClick={() =>
                setOpenTeamsForm({ ...openTeamsForm, delete: false })
              }
            >
              Cancel
            </button>
            <button
              className="bg-red-600 h-12 w-full flex items-center rounded-md justify-center text-gray-100"
              onClick={handleDelete}
            >
              Proceed
            </button>
          </div>
        </div>
      </Modal>

      <TableOverflow>
        {isLoadingTeams ? (
          <div className="flex items-center justify-center py-10">
            <ScaleLoader color={"#000"} />
          </div>
        ) : (
          <Table>
            <Thead>
              <tr>
                {table_headings?.map((heading, index) => (
                  <Th key={index}>{heading}</Th>
                ))}
              </tr>
            </Thead>

            <tbody>
              {teamsData?.map((item: any, index: number) => (
                <tr
                  className="border-b border-gray-200 z-10 overflow-visible"
                  key={item?._id}
                >
                  <Td>{item?.name}</Td>

                  {/* <Td>{formatDateToDDMMYY(item?.createdAt)}</Td> */}
                  <Td>{item?.description}</Td>

                  <Td className="z-0">
                    <div className="relative w-fit z-50 overflow-visible">
                      <VerticalMenu
                        isBackground={true}
                        width="min-w-[200px]"
                        className="relative z-50"
                      >
                        <div onClick={(e) => e.stopPropagation()}>
                          {rowOptions?.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => option?.action(item)}
                              className="block w-[200px] border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                            >
                              {option?.name}
                            </button>
                          ))}
                        </div>
                      </VerticalMenu>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableOverflow>
      {/* <Paginator /> */}
      <div className="w-full mt-2">{/* <Pagination {...pageProps} /> */}</div>
    </TableCard>
  );
}

export default TeamsTable;
