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
import AddTeams from "./AddTeams";

const table_headings = [
  "Staff Name",
  "Date Joined",
  "Email Address",
  "Status",
  "Action",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomersTable: React.FC<IProps> = ({ setLoading }) => {
  const {
    staffData,
    refetchStaffData,
    SuspendStaff,
    perPage,
    setPerPage,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    loadingStaff,
    isQuerying,
    queryedList,
    setIsQuerying,
    handleSearch,
  } = useStaff();

  const [open, setOpen] = useState(false);
  const [openTeamsForm, setOpenTeamsForm] = useState(false);

  const [openPAdd, setOpenPAdd] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [dataToRender, setDataToRender] = useState<any>([]);

  const [currentStaff, setCurrentStaff] = useState();

  // console.log(search);
  // console.log(permissionList);

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
  ];

  const pageProps = {
    data: staffData,
    perPage,
    setPerPage,
    pageNo: currentPage,
    setPageNo: setCurrentPage,
  };

  // console.log(rowOptions);

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
          <button
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
          </button>

          <button
            onClick={() => setOpenTeamsForm(true)}
            className="border border-[#262626] bg-[] text-[#262626] py-2.5 px-5 rounded-md"
          >
            Add New Team
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
        open={openTeamsForm}
        onClose={() => setOpenTeamsForm(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] pt-6">
          <AddTeams setOpenTeamsForm={setOpenTeamsForm} />
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
