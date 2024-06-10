"use client";
import React, { useEffect, useState, useRef } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import Heading from "@/features/shared/table/components/table-heading";
import Searchbar from "@/features/shared/table/components/searchbar";
import Filter from "@/features/shared/table/components/filter";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { RatingStar } from "@/public/svg";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
// import FilterBox from "./filter-box";
import { permissions } from "lib/api/permissions";
import { useQuery } from "react-query";
import useStaff from "@/lib/hooks/useStaff";
import { Modal } from "react-responsive-modal";
import AddStaff from "./AddStaff";
import "react-responsive-modal/styles.css";
import VerticalMenu from "@/components/shared/vertical-menu";
import EditPermissions from "./EditPermissions";
import toast from "react-hot-toast";

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
  const { staffData, SuspendStaff } = useStaff();

  const [open, setOpen] = useState(false);
  const [openPermissions, setOpenPermissions] = useState(false);

  const [currentStaff, setCurrentStaff] = useState();

  // console.log(staffData?.admins);
  // console.log(permissionList);

  const modalRef = useRef(null);
  const permissionRef = useRef(null);

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
              location.reload();
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

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        {/* <Heading name="Staff list" /> */}
        <div className="flex gap-8">
          <Searchbar
            placeholder="Search by name or email"
            // handleQuery={handleQuery}
            // notFound={notFound}
          />
          {/* <Filter showFilters={showFilters} setShowFilters={setShowFilters}>
            <FilterBox
              handleRatingFiltering={handleRatingFiltering}
              handleMonthFiltering={handleMonthFiltering}
              handleYearFiltering={handleYearFiltering}
              availableYears={availableYears}
              setShowFilters={setShowFilters}
            />
          </Filter> */}
        </div>
        <button
          onClick={() => setOpen(true)}
          className="border border-black bg-black text-white py-2.5 px-5 rounded-md"
        >
          Create Employee
        </button>
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
          <AddStaff />
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
          <EditPermissions currentStaff={currentStaff} />
        </div>
      </Modal>

      <TableOverflow>
        <Table>
          <Thead>
            <tr>
              {table_headings?.map((heading, index) => (
                <Th key={index}>{heading}</Th>
              ))}
            </tr>
          </Thead>

          <tbody>
            {staffData?.admins?.map((item: any, index: number) => (
              <tr key={item?._id} className="cursor-pointer">
                <Td>
                  {item?.firstName} {item?.lastName}
                </Td>
                <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                <Td>{item?.email}</Td>
                <Td>{item?.status}</Td>
                <Td>
                  <div onClick={(e) => e.stopPropagation()} className="w-fit">
                    <VerticalMenu isBackground={true}>
                      <div>
                        {rowOptions?.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              option?.action(item);
                            }}
                            className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
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
      </TableOverflow>
      {/* <Paginator /> */}
    </TableCard>
  );
};

export default CustomersTable;
