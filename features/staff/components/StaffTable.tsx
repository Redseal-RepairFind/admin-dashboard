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
import AddStaff from "./AddStaff";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import VerticalMenu from "@/components/shared/vertical-menu";
import EditPermissions from "./EditPermissions";
import AddPermission from "./AddPermission";
import toast from "react-hot-toast";
import { CompletedState, PendingState, SuspendedState } from "@/public/svg";
import Search from "@/components/shared/search";
import Pagination from "@/components/shared/pagination";
import { ScaleLoader } from "react-spinners";
import AddTeams from "@/features/shared/teams/components/AddTeams";
import { SubmitBtn } from "@/features/quiz/components";

const table_headings = [
  "Staff Name",
  "Date Joined",
  "Email Address",
  "Team",
  "Status",
  "Action",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Teams {
  item: any;
  openTeams: boolean;
  teamId: string;
}

type Toggle = { to: "add" | "edit"; text: string };

const CustomersTable: React.FC<IProps> = ({ setLoading }) => {
  const {
    staffData,
    refetchStaffData,
    SuspendStaff,
    perPage,
    currentPage,
    search,
    setSearch,
    loadingStaff,
    isQuerying,
    queryedList,
    setIsQuerying,
    handleSearch,
    teamsData,
    addStaffToTeam,
  } = useStaff();

  const [open, setOpen] = useState(false);
  const [openTeamsForm, setOpenTeamsForm] = useState<Teams>({
    item: null,
    openTeams: false,
    teamId: "",
  });

  const [openPAdd, setOpenPAdd] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [dataToRender, setDataToRender] = useState<any>([]);
  const [currentStaff, setCurrentStaff] = useState();
  const [toggle, setToggle] = useState<Toggle>({
    to: "add",
    text: "Add Admin to Team",
  });
  //
  // console.log(teamsData);
  // console.log(staffData);

  function toggleEditAdd() {
    setToggle((prevToggle) => ({
      to: prevToggle.to === "add" ? "edit" : "add",
      text: prevToggle.to === "add" ? "Edit Admin" : "Add Admin to Team",
    }));
  }

  useEffect(() => {
    isQuerying ? setDataToRender(queryedList) : setDataToRender(staffData);
  }, [isQuerying, queryedList, setDataToRender, staffData]);

  const modalRef = useRef(null);
  const permissionRef = useRef(null);
  const addPermissionRef = useRef(null);

  let rowOptions = [
    {
      name: "Edit Permissions",
      action: (item: any) => {
        // console.log(item);
        setCurrentStaff(item);
        setOpenPermissions(true);
      },
    },
    {
      name: "Suspend/Activate",
      action: async (item: any) => {
        if (
          confirm(
            `Are you sure you wish to ${
              item?.status === "ACTIVE" ? "suspend" : "activate"
            } this user?`
          )
        ) {
          toast.loading("Processing...");
          const payload = {
            staffId: item?._id,
            status: item?.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
          };
          try {
            const data = await SuspendStaff(payload);
            toast.remove();
            toast.success(data?.message);
            setTimeout(() => {
              refetchStaffData();
            }, 1000);
          } catch (e: any) {
            console.log(e);
            toast.remove();
            toast.error(e?.response?.data?.message);
          }
        }
      },
    },
    {
      name: "Edit Staff team",
      action: (item: any) => {
        setOpenTeamsForm({ ...openTeamsForm, item, openTeams: true });

        // console.log(item);
      },
    },
  ];

  // console.log(openTeamsForm);

  const pageProps = {
    data: staffData?.data,
  };

  console.log();

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full -z-50">
        {/* <Heading name="Staff list" /> */}
        <div className="flex gap-8">
          <Search
            search={search}
            setSearch={handleSearch}
            placeholder="Search..."
            setIsQuerying={setIsQuerying}
          />
        </div>
        <div className="flex items-center justify-end gap-4">
          {/* <button
            onClick={() => setOpenPAdd(true)}
            className="border border-[#262626] py-2.5 px-5 rounded-md"
          >
            Add Permission
          </button> */}
          <button
            onClick={() => setOpen(true)}
            className="border border-[#262626] bg-[#262626] text-white py-2.5 px-5 rounded-md"
          >
            Create Employee
          </button>
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] pt-6">
          <AddStaff setOpen={setOpen} />
        </div>
      </Modal>

      <Modal
        open={openPermissions}
        onClose={() => setOpenPermissions(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={permissionRef.current}
      >
        <div className="w-[600px] pt-6">
          {/* <h1 className="text-center font-bold text-xl py-5">Edit</h1> */}

          <EditPermissions
            refetch={refetchStaffData}
            hideModal={() => setOpenPermissions(false)}
            currentStaff={currentStaff}
          />
        </div>
      </Modal>
      <Modal
        open={openPAdd}
        onClose={() => setOpenPAdd(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={addPermissionRef.current}
      >
        <div className="w-[600px] pt-6">
          <AddPermission hideModal={() => setOpenPAdd(false)} />
        </div>
      </Modal>

      {/* <Modal
        open={openTeamsForm.openTeams}
        onClose={() =>
          setOpenTeamsForm({ teamId: "", item: null, openTeams: false })
        }
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[400px] flex flex-col gap-3">
          <h1 className="font-bold text-xl text-center">
            Add or remove staff from a team
          </h1>
          <p className="text-center">You can add or remove Staff from a team</p>
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => setOpenPAdd(true)}
              className="border border-[#262626] py-2.5 px-5 rounded-md"
            >
              Add Staff to team
            </button>
            <button
              onClick={() => setOpen(true)}
              className="border border-[#262626] bg-[#262626] text-white py-2.5 px-5 rounded-md"
            >
              Remove Staff from team
            </button>
          </div>
        </div>
      </Modal> */}

      <Modal
        open={openTeamsForm.openTeams}
        onClose={() =>
          setOpenTeamsForm({ teamId: "", item: null, openTeams: false })
        }
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] min-h-44 flex flex-col justify-between items-center pt-6">
          {/* <div className="flex items-center gap-3">
            <span className="font-bold">Add to Team</span>
            <button
              className="w-10 h-5 relative flex items-center rounded-2xl bg-gray-300 px-1"
              onClick={toggleEditAdd}
            >
              <div
                className={`h-4 w-4 rounded-full bg-gray-900 ${
                  toggle.to === "add" ? "left-[2px]" : "right-[2px]"
                } absolute transition-all duration-300`}
              />
            </button>
            <span className="font-bold">Edit Team</span>
          </div> */}

          <h1 className="text-center font-bold text-xl py-5">{toggle.text}</h1>

          <EditPermissions
            refetch={refetchStaffData}
            hideModal={() =>
              setOpenTeamsForm({ teamId: "", item: null, openTeams: false })
            }
            currentStaff={openTeamsForm?.item}
            type="addPermissions"
          />

          {/* <select
            name="Teams"
            id="teams"
            className="w-full"
            value={openTeamsForm.teamId}
            onChange={(e) =>
              setOpenTeamsForm({ ...openTeamsForm, teamId: e.target.value })
            }
          >
            <option value="" disabled>
              Select a team
            </option>
            {teamsData?.map((team: any) => (
              <option value={team?._id} key={team?._id}>
                {team?.name}
              </option>
            ))}
          </select> */}
          {/* <SubmitBtn className="w-full text-center flex items-center justify-center">
            Submit
          </SubmitBtn> */}
        </div>
      </Modal>

      <TableOverflow>
        {loadingStaff ? (
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
              {dataToRender?.data?.map((item: any, index: number) => (
                <tr
                  className="border-b border-gray-200 z-10 overflow-visible"
                  key={item?._id}
                >
                  <Td>
                    {item?.firstName} {item?.lastName}
                  </Td>
                  <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                  <Td>{item?.email}</Td>
                  <Td>
                    <span className="capitalize">
                      {item?.teams.length > 0
                        ? item?.teams.map((skill: any, index: number) => (
                            <span key={skill?._id} className="text-sm">
                              {skill.name}
                              {index < item?.teams.length - 1 && " || "}
                            </span>
                          ))
                        : "No Teams"}
                    </span>
                  </Td>

                  <Td>
                    <div
                      className="flex gap-[6px] items-center z-0"
                      style={{ zIndex: "1000" }}
                    >
                      {item?.status?.toLowerCase() === "active" ? (
                        <CompletedState />
                      ) : item?.status?.toLowerCase() === "suspended" ? (
                        <SuspendedState />
                      ) : (
                        <PendingState />
                      )}
                      <span
                        className={`capitalize font-medium ${
                          item?.status?.toLowerCase() === "active"
                            ? "text-green-500"
                            : item?.status?.toLowerCase() === "suspended"
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        {item?.status}
                      </span>
                    </div>
                  </Td>
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
      <div className="w-full mt-2">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};

export default CustomersTable;
