"use client";

import { useState, useRef, useEffect } from "react";
import TableCard from "@/features/shared/table/components/table-card";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import Heading from "@/features/shared/table/components/table-heading";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import VerticalMenu from "@/components/shared/vertical-menu";
import { CompletedState, PendingState, SuspendedState } from "@/public/svg";
import PromotionForm from "./CreatePromotion";
import { usePromotion } from "@/lib/hooks/usePromotion";
import { ScaleLoader } from "react-spinners";
import { formatCurrency } from "@/lib/utils/curencyConverter";
import toast from "react-hot-toast";

const table_headings = [
  "Name",
  "Criteria",
  "Start Date",
  "Status",
  "Target",
  "Discount",
  "Action",
];

const status = ["ACTIVE", "INACTIVE"];

function Promotion() {
  const [modal, setModal] = useState<any>({
    isOpenEdit: false,
    isOpenDelete: false,
    data: null,
  });

  const [isOpen, setIsOpen] = useState<any>({
    open: false,
    item: null,
  });

  const [promoOpen, setPromoOpen] = useState(false);

  const { Promotions, loadingPromo, refetchPromo, UpdatePromo, deletePromo } =
    usePromotion();

  console.log(Promotions);

  // Update isOpen.item whenever modal.data changes or a different modal is opened
  useEffect(() => {
    if (modal.data) {
      setIsOpen((prev: any) => ({
        ...prev,
        item: modal.data.status,
      }));
    }
  }, [modal.data, modal.isOpenEdit, modal.isOpenDelete]);

  function handleOpenModal(window: "edit" | "delete", data: any) {
    setModal((prevState: any) => ({
      ...prevState,
      isOpenEdit: window === "edit",
      isOpenDelete: window === "delete",
      data,
    }));
    setIsOpen((prevState: any) => ({
      ...prevState,
      item: data.status,
    }));
  }

  const editRef = useRef();
  const deleteRef = useRef();
  const promoRef = useRef();

  const openPromo = () => setPromoOpen(true);
  const closePromo = () => setPromoOpen(false);

  function handleCloseModal(window: "edit" | "delete") {
    setModal((prevState: any) => ({
      ...prevState,
      isOpenEdit: window === "edit" ? false : prevState.isOpenEdit,
      isOpenDelete: window === "delete" ? false : prevState.isOpenDelete,
    }));
  }

  function handleSelect(status: string) {
    setIsOpen((prevState: any) => ({
      ...prevState,
      open: false,
      item: status,
    }));
  }

  function submit() {
    console.log("submit");
  }

  function onSubmit(window: "edit" | "delete") {
    toast.loading(window === "edit" ? "Updating..." : "Deleting...");

    let mainData;

    // console.log(isOpen.item);

    // try {
    //   // const data: any = await UpdatePromo(mainData);
    //   toast.remove();
    //   // toast.success(data?.message);
    //   handleCloseModal?.(window);
    //   setTimeout(() => {
    //     refetchPromo();
    //   }, 1000);
    // } catch (error: any) {
    //   console.error(error);
    //   toast.remove();
    //   toast.error(error?.response?.data?.errors[0]?.msg);
    // }
  }

  return (
    <TableCard>
      <div className="flex items-center justify-between w-full mt-6">
        <Heading name="Promotion Lists" />
        <button
          onClick={openPromo}
          className="border border-[#262626] bg-[#262626] text-white py-2.5 px-5 rounded-md"
        >
          Create Promotion
        </button>
      </div>
      <Modal
        open={promoOpen}
        onClose={closePromo}
        classNames={{
          modal: "customModal",
        }}
        container={promoRef.current}
      >
        <Heading name="Create New Promotion" />

        <PromotionForm close={closePromo} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={modal.isOpenEdit}
        onClose={() => handleCloseModal("edit")}
        classNames={{
          modal: "customModal",
        }}
        container={editRef.current}
      >
        <Heading name="Update Promotion Status" />
        <div className="flex flex-col justify-between gap-4 min-w-[400px] max-w-screen-md mx-auto min-h-[400px] relative mt-6">
          <button
            className="w-full relative h-12 border border-black rounded-md flex items-center justify-between px-2"
            onClick={() =>
              setIsOpen((prevState: any) => ({
                ...prevState,
                open: !prevState.open,
              }))
            }
          >
            <p className="text-gray-700">
              {isOpen.item ? isOpen.item : modal?.data?.status}
            </p>
            {isOpen.open ? (
              <p className="font-bold text-3xl">&#8593;</p>
            ) : (
              <p className="font-bold text-3xl">&#8595;</p>
            )}
            {!isOpen.open && (
              <div className="w-full absolute flex flex-col items-start bg-white shadow-lg gap-4 left-0 right-0 py-3 top-12">
                {status.map((stat, i) => (
                  <span
                    key={i}
                    className={`w-full p-2 ${
                      stat === isOpen.item
                        ? "text-white bg-black"
                        : "bg-white text-black"
                    } hover:bg-gray-700 transition-all duration-500 hover:text-gray-100`}
                    onClick={() => handleSelect(stat)}
                  >
                    {stat}
                  </span>
                ))}
              </div>
            )}
          </button>
          <button
            className="bg-black text-gray-100 h-12 w-full items-center justify-center flex hover:bg-gray-700 transition-all duration-500 hover:text-gray-100 font-semibold rounded-md"
            onClick={() => submit()}
          >
            Update
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={modal.isOpenDelete}
        onClose={() => handleCloseModal("delete")}
        container={deleteRef.current}
        classNames={{
          modal: "customModal",
        }}
      >
        <div className="flex flex-col  gap-4 min-w-[400px] max-w-screen-md mx-auto">
          <Heading name="Delete Promotion" />
          {/* Confirmation for delete */}
          <p className="text-center">
            Are you sure you want to delete {modal?.data?.name} promotion? This
            action cannot be undone.
          </p>

          <div className="grid grid-cols-2 gap-2 items-center gap">
            <button
              className="bg-gray-200 h-12 w-full flex items-center rounded-md justify-center text-gray-800"
              onClick={() => handleCloseModal("delete")}
            >
              Cancel
            </button>
            <button className="bg-red-600 h-12 w-full flex items-center rounded-md justify-center text-gray-100">
              Proceed
            </button>
          </div>
        </div>
      </Modal>
      {loadingPromo ? (
        <div className="flex items-center justify-center py-10">
          <ScaleLoader color={"#000"} />
        </div>
      ) : (
        <TableOverflow>
          <Table>
            <Thead>
              <tr>
                {table_headings.map((heading, index) => (
                  <Th key={index}>{heading}</Th>
                ))}
              </tr>
            </Thead>
            <tbody>
              {Promotions?.data?.data?.map((item: any, index: number) => (
                <tr key={index}>
                  <Td>{item.name}</Td>
                  <Td>{item.criteria}</Td>
                  <Td>{formatDateToDDMMYY(item.startDate)}</Td>
                  <Td>
                    <span className="flex items-center gap-2">
                      {item.status === "ACTIVE" ? (
                        <CompletedState />
                      ) : item.status === "INACTIVE" ? (
                        <SuspendedState />
                      ) : (
                        <PendingState />
                      )}
                      <p
                        className={`${
                          item.status === "ACTIVE"
                            ? "text-green-600"
                            : item.status === "INACTIVE"
                            ? "text-red-600"
                            : "text-black"
                        } font-semibold`}
                      >
                        {item.status}
                      </p>
                    </span>
                  </Td>
                  <Td>{item.target}</Td>
                  <Td>
                    {item?.valueType === "FIXED"
                      ? formatCurrency(item.value)
                      : item?.value + "%"}
                  </Td>
                  <Td>
                    <div onClick={(e) => e.stopPropagation()}>
                      <VerticalMenu isBackground={true} right="50px">
                        <button
                          onClick={() => handleOpenModal("edit", item)}
                          className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        >
                          Edit Promotion
                        </button>
                        <button
                          onClick={() => handleOpenModal("delete", item)}
                          className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                        >
                          Delete Promotion
                        </button>
                      </VerticalMenu>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableOverflow>
      )}
    </TableCard>
  );
}

export default Promotion;
