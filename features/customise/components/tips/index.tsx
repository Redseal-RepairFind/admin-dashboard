"use client";

import SubmitBtn from "@/components/ui/submit-btn";
import LoadingTemplate from "@/features/layout/loading";
import Heading from "@/features/shared/table/components/table-heading";
import useCustomise from "@/lib/hooks/useCustomise";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaEllipsisV } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Modal from "react-responsive-modal";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/shared/pagination";
import { Header } from "@/features/quiz/components";
import { Form } from "./tip-form";
import Image from "next/image";
import { AnyAaaaRecord } from "dns";

function Tips() {
  const [isDropdown, setIsDropdown] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>();
  const [openModal, setOpenModal] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const modalRef = useRef(null);

  const { loadingTips, deleteTIPS, refetchTips, tips } = useCustomise();

  const [viewItem, setViewItem] = useState<any>({});

  // const [dataToRender, setDataToRender] = useState(faqs?.data);

  // console.log(tips);

  const pageProps = {
    data: tips?.data,
  };

  const params = useSearchParams();
  const perPage = params.get("perPage") || 10;

  const handleDelete = async () => {
    toast.loading("Deleting Tips...");
    // console.log(currentQuestion);
    try {
      await deleteTIPS(currentQuestion._id);
      toast.remove();
      toast.success("Tip deleted successfully");
      setOpenModal({ ...openModal, delete: false });
      setCurrentQuestion(null);
      refetchTips();
    } catch (error) {
      toast.remove();

      toast.error("Failed to delete Tip");
      console.error(error);
    }
  };

  const rowOptions = [
    {
      name: "Edit ",
      action: (item: any) => {
        setOpenModal({ ...openModal, edit: true });
        setCurrentQuestion(item);
      },
    },
    {
      name: "Delete ",
      action: (item: any) => {
        setOpenModal({ ...openModal, delete: true });
        setCurrentQuestion(item);
      },
    },
  ];

  if (loadingTips) return <LoadingTemplate />;

  return (
    <div
      className="flex flex-col gap-6 mt-8 pb-20 max-w-[700px] "
      onClick={() => setOpenMenu("")}
    >
      <Modal
        open={openModal.delete}
        onClose={() => setOpenModal({ ...openModal, delete: false })}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="flex flex-col   gap-4 max-w-[480px] mx-auto">
          <div className="flex items-center justify-center">
            <Heading name={"Delete Tip"} />
          </div>
          {/* Confirmation for delete */}
          <p className="text-center">
            Are you sure you want to delete Tip? This action cannot be undone.
          </p>

          <div className="grid grid-cols-2 gap-2 items-center gap">
            <button
              className="bg-gray-200 h-12 w-full flex items-center rounded-md justify-center text-gray-800"
              onClick={() => setOpenModal({ ...openModal, delete: false })}
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

      <Modal
        open={openModal.create}
        onClose={() => setOpenModal({ ...openModal, create: false })}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] p-6">
          <Form
            type="new"
            close={() => setOpenModal({ ...openModal, create: false })}
          />
        </div>
      </Modal>

      <Modal
        open={openModal.edit}
        onClose={() => setOpenModal({ ...openModal, edit: false })}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[600px] p-6">
          <Form
            type="edit"
            editData={currentQuestion}
            close={() => setOpenModal({ ...openModal, edit: false })}
          />
        </div>
      </Modal>
      <Modal
        open={viewItem?.url}
        onClose={() => setViewItem(null)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        {
          <div className="w-[300px] h-36 mt-5">
            {viewItem?.type === "IMAGE" ? (
              <div className="w-full h-full relative">
                <Image
                  src={viewItem?.url}
                  alt={viewItem?.type || "Uploaded File"}
                  fill
                  content=""
                />
              </div>
            ) : !viewItem?.type ? null : (
              <video width="300" height="160" controls>
                <source src={viewItem?.url} type={"vido/mp4"} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        }
      </Modal>

      <div className="flex items-center gap-20">
        <button
          className="bg-gray-800 text-gray-50 py-2 px-4 rounded-sm"
          onClick={() => setOpenModal({ ...openModal, create: true })}
        >
          Create new Tip
        </button>

        {/* <Filter filterProps={["All", "contractor", "customer"]} /> */}
      </div>
      {tips?.data?.data?.map((faq: any, i: number) => (
        <div key={faq?._id} className="relative">
          <div className="flex items-center gap-4">
            <div
              className="bg-white px-6 py-2.5 flex rounded-md min-w-[700px] max-w-[700px] items-center justify-between shadow-sm cursor-pointer"
              onClick={() =>
                setIsDropdown((prevId) =>
                  prevId === faq?._id ? null : faq?._id
                )
              }
            >
              <div className="flex">
                <p className="font-[500] pr-4">{i + 1}</p>
                <p className="capitalize text-sm w-full">{faq?.question}</p>
              </div>
              <div>
                {isDropdown === faq?._id ? (
                  <IoMdArrowDropup />
                ) : (
                  <IoMdArrowDropdown />
                )}
              </div>
            </div>

            {/* Options Menu Button */}
            <div className="relative">
              <button
                type="button"
                className="border border-gray-400 bg-gray-400 py-2 px-4 rounded-md text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu((prevId) =>
                    prevId === faq?._id ? null : faq?._id
                  );
                }}
              >
                <FaEllipsisV />
              </button>

              {/* Options Menu */}
              {openMenu === faq?._id && (
                <div
                  className="absolute top-[-10px] right-[-200px] bg-white border border-slate-100 shadow-md rounded-md z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {rowOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => option.action(faq)}
                      className="block w-[200px] px-4 py-2 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FAQ Answer Section */}
          {isDropdown === faq?._id && (
            <div className="bg-white px-6 py-2.5 flex flex-col rounded-b-md max-w-[700px] gap-6">
              <p className="text-gray-400 text-sm">{faq?.answer}</p>
              <Header title="Media" size="small" />

              <div className="flex flex-wrap gap-4">
                {faq?.media?.map((media: any, i: number) => {
                  if (media?.type === "IMAGE") {
                    return (
                      <button
                        key={i}
                        className="shadow-xl"
                        onClick={() => setViewItem(media)}
                      >
                        <Image
                          src={media?.url}
                          alt={media?.type || "Uploaded File"}
                          width={40}
                          height={20}
                        />
                      </button>
                    );
                  } else {
                    return (
                      <button
                        key={i}
                        className="shadow-xl"
                        onClick={() => setViewItem(media)}
                      >
                        <video width="150" height="100" controls>
                          <source src={media?.url} type={`video/mp4`} />
                          Your browser does not support the video tag.
                        </video>
                      </button>
                    );
                  }
                })}
              </div>

              {/* <div key={index} className="relative shadow-lg">
               
                <button
                  className="border-gray-800 bg-gray-800 text-white h-5 w-5 flex items-center justify-center rounded-full absolute top-[-4px] right-[-4px]"
                  onClick={(e) => {
                    e.preventDefault();
                    setFiles((prev) => ({
                      ...prev,
                      videos: prev.videos.filter((_, i) => i !== index), // Fix: Remove from videos, not images
                    }));
                  }}
                >
                  <span>x</span>
                </button>
              </div> */}

              {/*  */}
            </div>
          )}
        </div>
      ))}
      {tips?.data?.data?.length >= Number(perPage) ? (
        <Pagination {...pageProps} />
      ) : null}
    </div>
  );
}

export default Tips;

export type FilterProp = {
  filterProps: any[];
};
