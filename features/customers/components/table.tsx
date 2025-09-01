"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import FilterBox from "./filter-box";
import { useCustomersTable } from "../hooks/table";
import useCustomers from "@/lib/hooks/useCustomers";
import VerticalMenu from "@/components/shared/vertical-menu";
import Pagination from "@/components/shared/pagination";
import {
  CompletedState,
  PendingState,
  RatingStar,
  YellowStar,
} from "@/public/svg";
import Search from "@/components/shared/search";
import { useRouter, useSearchParams } from "next/navigation";
import { filterData } from "../hooks/filterByDate";
import SortLists from "@/app/_components/Sort";
import { sortContractors } from "@/lib/utils/sortData";
import CheckBox from "@/app/_components/Check-box";
import { useCheckedList } from "@/context/checked-context";
import { useSortedData } from "@/lib/hooks/useSortedData";
import LoadingTemplate from "@/features/layout/loading";
import Empty from "@/components/ui/empty-data";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/ui/submit-btn";
import Modal from "react-responsive-modal";
import { useSubscription } from "@/lib/hooks/useSubscriptions";

const table_headings = [
  "Select All",
  "Customer’s Name",
  "Date Joined",
  "Email Address",
  "Phone Number",
  "Customer type",
];

type Checked = {
  isChecked: boolean;
  items: any;
};

type CheckedObj = {
  [key: string]: Checked;
};

const headings = [
  {
    header: "",
    options: "",
  },
];

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  filteredData: any;
  handleSearch: any;
  setIsQuerying: any;
  loadingSortedData: boolean;
  isQuerying: boolean;
  setSearchTerm: any;
  refetch: any;
  isRefetching: any;
  type: "norm" | "sub";
}

export const equipmentAge = [
  {
    name: "1 - 4 years",
    id: "1-4",
    tag: "Tailored plans for businesses managing multiple properties and equipment.",
    variant: "green",
  },
  {
    name: "5 - 8 years",
    id: "5-8",
    tag: "Tailored plans for businesses managing multiple properties and equipment.",
    variant: "green",
  },
  {
    name: "9+",
    id: "9+",
    tag: "Tailored plans for businesses managing multiple properties and equipment.",
    variant: "green",
  },
  // {
  //   name: "I don't know",
  //   id: "Unknown",
  //   tag: "Tailored plans for businesses managing multiple properties and equipment.",
  //   variant: "green",
  // },
];

const CustomersTable: React.FC<IProps> = ({
  setLoading,
  filteredData,
  handleSearch,
  setIsQuerying,
  loadingSortedData,
  isQuerying,
  setSearchTerm,
  refetch,
  isRefetching,
  type,
}) => {
  const { handleViewACustomer } = useCustomersTable({ setLoading });
  const [rewardPercent, setRewardPercent] = useState<string>();
  const [openModalToggle, setOpenModalToggle] = useState(false);
  const [item, setItem] = useState<any>();
  const ref = useRef();
  const [ageModal, setAgeModal] = useState({
    open: false,
    age: "",
    ageCategory: "",
    verifierName: "",
  });
  // const [dataToRender, setDataToRender] = useState<any[]>();
  // filteredData?.data?.data

  const { updateEquipmentAge, isUpdateEquipmentAge } = useSubscription(type);

  const handleToggleGeModal = (
    type: "open" | "age" | "ageCategory" | "verifierName",
    data: any,
    isClose?: boolean
  ) => {
    // if (type === "open") {
    //   setAgeModal((agem) => ({
    //     ...agem,
    //     open: data,
    //   }));

    //   return
    // }

    if (isClose) {
      setAgeModal({
        open: false,
        age: " ",
        ageCategory: "",
        verifierName: "",
      });
      setItem(null);
      return;
    }
    setAgeModal((agem) => ({
      ...agem,
      [type]: data,
    }));
  };

  const handleModalToggleOpen = (item: any) => {
    setOpenModalToggle(true);
    setItem(item);
  };
  const handleModalToggleClose = () => {
    setOpenModalToggle(false);
    setItem(null);
    setRewardPercent("");
  };

  const {
    customerData,
    loadingCustomers,
    perPage,
    currentPage,
    search,
    setSearch,
    toggleCustomerElite,
    isTogglingCustomerElite,
  } = useCustomers();

  // console.log(isQuerying);
  let rowOptions = [
    {
      name: "View Customer",
      action: async (item: any) => handleViewACustomer(item),
    },
    {
      name: "Promote customer",
      action: async (item: any) => handleModalToggleOpen(item),
    },
  ];

  let rowPendingOptions = [
    {
      name: "Cancel Invite",
      action: async (item: any) => {},
    },
  ];

  const searchParams = useSearchParams();

  const pageProps = {
    data: filteredData?.data,
  };

  // useEffect(() => {
  //   const rightFullString = params?.replaceAll("_", " ");
  //   const array = sortContractors(filteredData?.data?.data, rightFullString);

  //   setDataToRender(array);
  // }, [filteredData?.data?.data, params]);

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

  const { checkedList, setCheckedList, handleCheck, handleSelectAll } =
    useCheckedList();

  const mainData = filteredData?.data?.data;
  const param = useSearchParams();

  const sub = param.get("sub") || "all";
  // console.log(mainData);

  const handleToggle = async () => {
    const isElite = item?.isElite;

    // console.log(isElite);
    if (!rewardPercent && !isElite) {
      toast.error("Kindly specify the customers earning percentage per job");
      return;
    }
    try {
      toast.loading(
        isElite
          ? "Demoting customer.. .. .. .."
          : "Promoting customer.. .. .. .."
      );

      await toggleCustomerElite({
        payload: {
          rewardPercent: Number(rewardPercent) || 0,
          email: item?.email,
        },
        id: item?.id,
      });

      toast.remove();
      toast.success(
        isElite
          ? "Customer demoted successfully"
          : "Customer  promoted successfully"
      );

      handleModalToggleClose();

      // closeModal("promote");
      await refetch();
    } catch (error: any) {
      toast.remove();
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const handleUpdateEquipmentAge = async () => {
    console.log(ageModal);
    if (!ageModal.ageCategory || !ageModal.age) {
      toast.error("Select and enter age and age categories");
      return;
    }

    if (!ageModal.verifierName) {
      toast.error("Enter Verifier name");
      return;
    }

    toast.loading("Updating subscription age.......");
    try {
      await updateEquipmentAge({
        id: item?.id,
        equipmentAge: Number(ageModal?.age),
        equipmentAgeCategory: ageModal.ageCategory,
        verifierName: ageModal.verifierName,
      });

      toast.remove();

      toast.success("Age Update Successful");

      handleToggleGeModal("open", false, true);

      refetch();
    } catch (error: any) {
      console.error("update sub error", error);
      toast.remove();
      toast.error(error?.response?.data?.data?.message || "Age update failted");
    }
  };

  return (
    <TableCard>
      <Modal
        onClose={() => handleModalToggleClose()}
        open={openModalToggle}
        center
        classNames={{
          modal: "customModal",
        }}
        container={ref.current}
      >
        <div className="w-full max-w-[450px] py-8">
          <h1 className="font-semibold text-center">
            You are about to {item?.isElite ? "Demote" : "promote "}{" "}
            <span className={item?.isElite ? "text-red-600" : "text-green-600"}>
              {item?.name}
            </span>{" "}
            {item?.isElite ? "from " : " to "}
            the elite customer status
          </h1>
          {item?.isElite ? null : (
            <input
              type="number"
              placeholder="Enter Percentage earnable by customer"
              value={rewardPercent}
              onChange={(e) => setRewardPercent(e.target.value)}
              className={`outline-none border py-2 px-4 rounded-md w-full`}
            />
          )}

          <p className="py-2">
            Kindly press the proceed button to confirm this action
          </p>
          <SubmitBtn
            isSubmitting={isTogglingCustomerElite}
            onClick={() => handleToggle()}
          >
            Proceed
          </SubmitBtn>
        </div>
      </Modal>
      <Modal
        onClose={() => handleToggleGeModal("open", false, true)}
        open={ageModal.open}
        center
        classNames={{
          modal: "customModal",
        }}
        container={ref.current}
      >
        <div className="w-full max-w-[450px] py-8 flex flex-col gap-3">
          <h1 className="font-semibold text-center">
            You are about to Update{" "}
            <span className={"text-green-600"}>{item?.firstName}'s</span>{" "}
            Equipment age
          </h1>
          <p className="py-2">
            Kindly press the proceed button to confirm this action
          </p>

          <input
            type="text"
            placeholder="Enter verifier's Name"
            value={ageModal.verifierName}
            onChange={(e) =>
              handleToggleGeModal("verifierName", e.target.value)
            }
            className={`outline-none border py-2 px-4 rounded-md w-full mb-2`}
          />
          <input
            type="number"
            placeholder="Enter Equipment age"
            value={ageModal.age}
            onChange={(e) => handleToggleGeModal("age", e.target.value)}
            className={`outline-none border py-2 px-4 rounded-md w-full mb-2`}
          />

          <select
            className="outline-none border py-2 px-4 rounded-md w-full"
            onChange={(e) => {
              handleToggleGeModal("ageCategory", e.target.value); // now gives you the id
              console.log(e.target.value); // e.g. "1-4"
            }}
          >
            <option value="">Select equipment age category</option>
            {equipmentAge?.map((age) => (
              <option key={age.id} value={age.id}>
                {age.name}
              </option>
            ))}
          </select>

          <SubmitBtn
            isSubmitting={isUpdateEquipmentAge}
            onClick={() => handleUpdateEquipmentAge()}
          >
            Proceed
          </SubmitBtn>
        </div>
      </Modal>
      <div className="flex items-center justify-between w-full  ">
        <Heading
          name={
            type === "norm" ? "Customers’ list" : "Subscription Customers’ list"
          }
        />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold ">Sort List</h1>
          <SortLists sortProps={sortProps} initialState="Name (A-Z)" />
        </div>
        <Search
          search={search}
          setSearch={handleSearch}
          placeholder="Search..."
          setIsQuerying={setIsQuerying}
          handleEmpty={setSearchTerm}
        />
      </div>

      <TableOverflow>
        {loadingSortedData && isQuerying ? (
          <LoadingTemplate />
        ) : (
          <Table>
            <Thead>
              <tr>
                {table_headings?.map((heading, index) =>
                  heading === "Select All" ? (
                    <th
                      key={"Select"}
                      className="flex items-center gap-2 py-4 px-2"
                    >
                      {/* <span className=" font-[500] px-5 py-3">{heading}</span> */}
                      <CheckBox
                        onClick={(event: any) => {
                          event.stopPropagation();

                          handleSelectAll(filteredData);
                        }}
                        isChecked={
                          checkedList.length ===
                          filteredData?.data?.data?.length
                        }
                      />
                    </th>
                  ) : (
                    <Th key={index}>{heading}</Th>
                  )
                )}

                {type === "sub" ? (
                  <>
                    <th>Plan</th>
                    <th>Plan Status</th>
                  </>
                ) : null}
                <th>Action</th>
              </tr>
            </Thead>

            {
              mainData?.length > 0 ? (
                <tbody>
                  {mainData?.map((item: any, index: number) => (
                    <tr
                      key={item?._id}
                      onClick={() => handleViewACustomer(item)}
                      className="cursor-pointer border-b border-gray-200"
                    >
                      <td className="flex items-center px-2 py-4 h-full">
                        <CheckBox
                          onClick={(event: any) => {
                            event.stopPropagation();
                            handleCheck(item);
                          }}
                          isChecked={checkedList.some(
                            (data: any) => data === item
                          )}
                        />
                      </td>
                      <Td>{item?.name}</Td>
                      <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                      <Td>{item?.email}</Td>
                      <Td>
                        {item?.phoneNumber?.code}
                        {item?.phoneNumber?.number}
                      </Td>

                      {/* <Td>
                  <div className="flex gap-[6px] items-center">
                    {item?.status === "active" ? (
                      <CompletedState />
                    ) : (
                      <PendingState />
                    )}
                    <span
                      className={`capitalize font-medium ${
                        item?.status === "active" ? "text-green-500" : ""
                      }`}
                    >
                      {item?.status}
                    </span>
                  </div>
                </Td> */}

                      <Td>
                        {item?.isElite ? "Elite Customer" : "Normal Customer"}
                      </Td>
                      {type === "sub" ? (
                        <>
                          <Td>{item?.subscription?.planType}</Td>
                          <Td>{item?.subscription?.status}</Td>
                        </>
                      ) : null}
                      <Td>
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="w-fit relative"
                        >
                          <VerticalMenu
                            isBackground={true}
                            // className="relative"
                          >
                            {item?.status === "in-review" ? (
                              <div className="">
                                {rowPendingOptions?.map((option, index) => (
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
                            ) : (
                              <div className="">
                                {rowOptions?.map((option, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      option?.action(item);
                                    }}
                                    className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                  >
                                    {option?.name?.includes("Promote")
                                      ? item?.isElite
                                        ? "Demote Customer"
                                        : "Promote Customer"
                                      : option?.name}
                                  </button>
                                ))}

                                {sub === "unknown" ? (
                                  <button
                                    className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                    onClick={() => {
                                      handleToggleGeModal("open", true);
                                      setItem(item);
                                    }}
                                  >
                                    Update equipment age
                                  </button>
                                ) : null}
                              </div>
                            )}
                          </VerticalMenu>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              ) : null
              // <Empty message="No Customers found" />
            }
          </Table>
        )}
      </TableOverflow>
      <div className="w-full mt-2">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};

export default CustomersTable;
