"use client";
import React, { useRef, useState } from "react";
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
import {
  CompletedState,
  PendingState,
  RatingStar,
  YellowStar,
} from "@/public/svg";
import Action from "./action";
import { filledArrayFromNumber } from "@/lib/utils/array-from-number";
import { trimString } from "@/lib/utils/trim-string";
import { useContractorTable } from "../hooks/table";
import Ratings from "@/components/shared/ratings";
import Pagination from "@/components/shared/pagination";
import SortLists from "@/app/_components/Sort";

import Search from "@/components/shared/search";
import CheckBox from "@/app/_components/Check-box";
import { useCheckedList } from "@/context/checked-context";
import ActionButton from "@/features/shared/inner-pages/action-button";
import { FaArrowDown } from "react-icons/fa";
import Modal from "react-responsive-modal";
import DeleteModal from "@/features/customise/components/promotions/DeleteModal";
import { SubmitBtn } from "@/features/quiz/components";
import useContractors from "@/lib/hooks/useContractors";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import useAdminPermissions from "@/lib/hooks/useAdminPermissions";
import LoadingTemplate from "@/features/layout/loading";
import Empty from "@/components/ui/empty-data";

const table_headings = [
  "Select All",
  "Contractor’s Name",
  "Email Address",
  "Skill",
  "Sign-up Stage",
  "Certn. Method",
  "Certn. Status",
  "Account Status",
  // "No of Jobs",
  "Strikes",
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  contractorData: any;
  handleSearch: any;
  setIsQuerying: any;
  loadingSortedData: boolean;
  isQuerying: boolean;
  setSearchTerm: any;
}

const ContractorsTable: React.FC<IProps> = ({
  setLoading,
  contractorData,
  handleSearch,
  setIsQuerying,
  loadingSortedData,
  isQuerying,
  setSearchTerm,
}) => {
  const { handleViewAContractors } = useContractorTable({ setLoading });

  const { giveMultipleManualCertn, deleteMultipleContractor } =
    useContractors();
  const queryClient = useQueryClient();

  const mainData = contractorData?.data;
  const [open, setOpen] = useState({
    manualCertn: false,
    delete: false,
    edit: false,
  });
  const editRef = useRef();
  const deleteRef = useRef();
  function openModal(name: "manualCertn" | "delete" | "edit") {
    setOpen({ ...open, [name]: true });
  }

  function closeModal() {
    setOpen({ edit: false, manualCertn: false, delete: false });
  }

  const pageProps = {
    data: mainData,
  };
  const sortProps = [
    {
      url: "firstName",
      render: "Name (A-Z)",
    },
    {
      url: "-firstName",
      render: "Name (Z-A)",
    },
    {
      url: "-createdAt",
      render: "Date Joined (latest)",
    },
    {
      url: "createdAt",
      render: "Date Joined (oldest)",
    },
  ];

  const { checkedList, handleCheck, handleSelectAll, setCheckedList } =
    useCheckedList();
  const { adminPermissions } = useAdminPermissions();

  const ids = checkedList?.map((data: any) => data?._id);

  async function handleMultipleCertns() {
    if (!adminPermissions.data.includes("manage_contractors")) {
      toast.error("You don't have permission to update contractor");
      return;
    }
    toast.loading("Processing...");
    const contractorIds = {
      contractorIds: ids,
    };
    try {
      await giveMultipleManualCertn(contractorIds);

      toast.remove();
      toast.success("Contractor(s) Certn. status updated successfully");
      queryClient.invalidateQueries("sortData");
      setCheckedList([]);
      closeModal();
    } catch (error: any) {
      console.error("Error while updating multiple contractors: ", error);
      toast.remove();
      toast.error(
        error?.response?.data?.message ||
          "Error while updating while updating contractors certn"
      );
    }
  }

  // console.log(contractorData);

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Contractors’ list" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold ">Sort List</h1>
          <SortLists sortProps={sortProps} initialState="Name (A-Z)" />
        </div>

        {checkedList.length > 0 ? (
          <div className="relative min-w-[200px] ">
            <button
              className="bg-gray-50 px-4 py-2 rounded-sm border border-gray-300 text-gray-800 "
              onClick={open.edit ? () => closeModal() : () => openModal("edit")}
            >
              Update selected Contractors
            </button>
            {open.edit ? (
              <div className="flex flex-col gap-4 absolute inset-0 p-4 h-[150px] top-12 bg-white rounded-md shadow-xl">
                <ActionButton
                  actionName="Manually assign Certn."
                  onClick={() => openModal("manualCertn")}
                  color="border-green-600 text-green-600"
                />

                <ActionButton
                  actionName="Delete Contractor"
                  onClick={() => openModal("delete")}
                  color="border-red-600 text-red-600"
                />
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="flex gap-8">
          <Search
            placeholder="Search by name"
            setSearch={handleSearch}
            setIsQuerying={setIsQuerying}
            search=""
            handleEmpty={setSearchTerm}
          />
        </div>
      </div>
      <Modal
        onClose={() => closeModal()}
        open={open.delete}
        center
        classNames={{
          modal: "customModal",
        }}
        container={deleteRef.current}
      >
        <DeleteModal
          name="Contractor"
          closeModal={() => {
            closeModal();
          }}
          onSubmit={deleteMultipleContractor}
          type=""
          title={`Are you sure you want to delete Contractor? `}
          who="contractor"
          ids={ids}
        />
      </Modal>

      <Modal
        onClose={() => closeModal()}
        open={open.manualCertn}
        center
        classNames={{
          modal: "customModal",
        }}
        container={editRef.current}
      >
        <div className="max-w-[400px] px-4">
          <h1 className="font-semibold text-center text-xl">
            Are you sure you want to Manually give contractor(s) Certn pass?
          </h1>

          <p className="text-gray-400 text-center text-sm">
            Make sure he passed the necessary criteria before you proceed
          </p>

          <div className="w-full items-center mt-6 flex gap-3">
            <button
              className="bg-gray-200 h-12 w-full  flex items-center rounded-md justify-center text-gray-800"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </button>
            <SubmitBtn onClick={handleMultipleCertns}>Proceed</SubmitBtn>
          </div>
        </div>
      </Modal>
      <TableOverflow>
        {loadingSortedData && isQuerying ? (
          <LoadingTemplate />
        ) : (
          <Table>
            {/* <LoadingTemplate /> */}
            <Thead>
              <tr>
                {table_headings?.map((heading, index) =>
                  heading === "Select All" ? (
                    <th
                      key={"Select"}
                      className="flex items-center justify-center gap-2 h-12 pl-2 w-8"
                    >
                      <CheckBox
                        onClick={(event: any) => {
                          event.stopPropagation(); // Prevents event from bubbling to parent elements
                          handleSelectAll(contractorData);
                        }}
                        isChecked={
                          checkedList?.length ===
                          contractorData?.data?.data?.length
                        }
                      />
                    </th>
                  ) : (
                    <Th key={index}>{heading}</Th>
                  )
                )}
              </tr>
            </Thead>

            {mainData?.data?.length > 0 ? (
              <tbody>
                {mainData?.data?.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="cursor-pointer border-b border-gray-200"
                    onClick={() => {
                      sessionStorage.setItem(
                        "current_contractor_jobs",
                        JSON.stringify(item?.job)
                      );
                      handleViewAContractors(item);
                    }}
                  >
                    <td className="flex items-center justify-center gap-2 h-12 pl-2 w-8">
                      <CheckBox
                        onClick={(event: any) => {
                          event.stopPropagation(); // Prevents event from bubbling to parent elements
                          handleCheck(item);
                        }}
                        isChecked={checkedList?.some(
                          (data: any) => data === item
                        )}
                      />
                    </td>
                    <Td>
                      <span className="capitalize">{item?.name}</span>
                    </Td>
                    <Td>{item?.email}</Td>
                    <Td>
                      <span className="capitalize">
                        {item?.profile?.skill ||
                          item?.profile?.skills?.map(
                            (skill: string, index: number) => (
                              <span key={skill} className="text-sm">
                                {skill}
                                {index < item?.profile?.skills.length - 1 &&
                                  " || "}
                              </span>
                            )
                          ) ||
                          "No Skills"}
                      </span>
                    </Td>
                    <Td>{item?.onboarding?.stage?.label}</Td>
                    <Td>
                      {item?.certnStatus === "COMPLETE" && item?.hasManualCertn
                        ? "Manual"
                        : item?.certnStatus === "COMPLETE" &&
                          !item?.hasManualCertn
                        ? "Automatic"
                        : "No Certn."}
                    </Td>
                    <Td>{item?.certnStatus}</Td>
                    <Td>
                      {item?.accountStatus === "REVIEWING"
                        ? "INACTIVE"
                        : item?.accountStatus.includes("APPROVE")
                        ? "ACTIVE"
                        : item?.accountStatus}
                    </Td>

                    <Td>
                      {/* <Ratings rating={item?.rating} /> */}
                      {item?.sanctions?.length}
                    </Td>

                    {/* Actions */}
                    {/* <Td>
                  <Action setLoading={setLoading} id={item?._id} />
                </Td> */}
                  </tr>
                ))}
              </tbody>
            ) : (
              <Empty message="No Contractors found" />
            )}
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

export default ContractorsTable;
