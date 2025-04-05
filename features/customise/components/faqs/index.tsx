"use client";

import SubmitBtn from "@/components/ui/submit-btn";
import LoadingTemplate from "@/features/layout/loading";
import Heading from "@/features/shared/table/components/table-heading";
import useCustomise from "@/lib/hooks/useCustomise";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEllipsisV } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Modal from "react-responsive-modal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function Faqs() {
  const [isDropdown, setIsDropdown] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>();
  const [openModal, setOpenModal] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const modalRef = useRef(null);

  const { faqs, loadingFaqs, deleteFAQ, refetchFaqs } = useCustomise();

  const [dataToRender, setDataToRender] = useState(faqs?.data);

  // console.log(faqs);

  const params = useSearchParams();
  const filter = params.get("filter") || "All";
  useEffect(() => {
    if (faqs?.data && filter !== "All") {
      setDataToRender(
        faqs?.data?.filter((faq: any) =>
          faq?.category?.toLowerCase()?.includes(filter?.toLowerCase())
        )
      );
    } else {
      setDataToRender(faqs?.data);
    }
  }, [filter, faqs?.data]);

  const handleDelete = async () => {
    toast.loading("Deleting FAQ...");
    console.log(currentQuestion);
    try {
      await deleteFAQ(currentQuestion._id);
      toast.remove();
      toast.success("FAQ deleted successfully");
      setOpenModal({ ...openModal, delete: false });
      setCurrentQuestion(null);
      refetchFaqs();
    } catch (error) {
      toast.remove();

      toast.error("Failed to delete FAQ");
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

  if (loadingFaqs) return <LoadingTemplate />;

  return (
    <div
      className="flex flex-col gap-6 mt-8 pb-20"
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
            <Heading name={"Delete Question"} />
          </div>
          {/* Confirmation for delete */}
          <p className="text-center">
            Are you sure you want to delete Question? This action cannot be
            undone.
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

      <div className="flex items-center gap-20">
        <button
          className="bg-gray-800 text-gray-50 py-2 px-4 rounded-sm"
          onClick={() => setOpenModal({ ...openModal, create: true })}
        >
          Create new Question
        </button>

        <Filter filterProps={["All", "contractor", "customer"]} />
      </div>
      {dataToRender?.map((faq: any, i: number) => (
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
            <div className="bg-white px-6 py-2.5 flex rounded-b-md max-w-[700px]">
              <p className="text-gray-400 text-sm">{faq?.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Faqs;

const Form = ({
  type,
  editData,
  close,
}: {
  type: "edit" | "new";
  editData?: any;
  close: () => void;
}) => {
  const { register, handleSubmit, formState } = useForm();
  const { updateFAQ, refetchFaqs, createFAQ, isEditing, isCreating } =
    useCustomise();

  const { errors } = formState;

  const onSubmit = async (data: any) => {
    try {
      toast.loading(type === "edit" ? "Editing Data..." : "Creating Data...");
      if (type === "edit") {
        await updateFAQ({ id: editData?._id, payload: data });
      } else {
        await createFAQ(data);
      }
      toast.remove();
      toast.success(
        type === "edit" ? "Edit Successful" : "Question Created successfully"
      );
      refetchFaqs();
      close(); // Ensure modal closes after successful submission
    } catch (error: any) {
      toast.remove();
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-4 bg-white rounded-md gap-5"
    >
      <Heading
        name={type === "edit" ? "Edit Question" : "Create New Question"}
      />
      <div className="mb-4 mt-8">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Question
        </label>
        <input
          type="text"
          id="question"
          {...register("question", { required: "Enter a valid question" })}
          className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          defaultValue={type === "edit" ? editData?.question : ""}
        />
        {errors.question && (
          <p className="text-red-500 text-xs italic">
            {errors.question.message?.toString()}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Answer
        </label>
        <textarea
          id="answer"
          rows={4}
          cols={4}
          {...register("answer", {
            required: "Describe the the answer",
          })}
          className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          defaultValue={type === "edit" ? editData?.answer : ""}
        />
        {errors.answer && (
          <p className="text-red-500 text-xs italic">
            {errors?.answer?.message?.toString()}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="Category"
        >
          Category
        </label>
        <select
          id=""
          className="w-full border border-gray-500 py-3 rounded-md"
          {...register("category", {
            required: "Select a category",
          })}
          defaultValue={type === "edit" ? editData?.category : ""}
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="customer">Customer</option>
          <option value="contractor">Contractor</option>
        </select>

        {errors.category && (
          <p className="text-red-500 text-xs italic">
            {errors.category.message?.toString()}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <SubmitBtn isSubmitting={isCreating || isEditing}>Submit</SubmitBtn>
      </div>
    </form>
  );
};

type FilterProp = {
  filterProps: any[];
};

function Filter({ filterProps }: FilterProp) {
  const pathname = usePathname();
  const router = useRouter();
  const param = useSearchParams();

  // Fetch the initial 'sort' parameter from the URL (query)
  const initialString = param.get("filter");
  const initialSortValue = initialString
    ? initialString.replace(/_/g, " ")
    : "All";

  // Set the selected sort value state, initialize with the value from URL
  const [sortValue, setSortValue] = useState(initialSortValue);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [sortValue]);

  // On page load, ensure the sort value in the state is in sync with URL
  useEffect(() => {
    const sortFromParam = param.get("filter");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue); // Update state based on URL query params
    }
  }, [param]);

  // Function to update the URL params and the state
  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase(); // Replace spaces with underscores

    // Update the URL query parameters
    if (value === "All") {
      router.replace(`${pathname}`, {
        scroll: false,
      }); // Remove query params if 'All' is selected (default)
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("filter", formattedValue); // Set the selected filter in query params
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    // Set the selected value in the state
    setSortValue(value);
  }

  return (
    <button
      className="text-xs font-medium border border-gray-400 rounded-sm py-4 px-2 focus:ring-0 outline-none relative w-28 bg-white transition-all duration-500 flex justify-between items-center"
      onClick={() => setIsOpen((is) => !is)}
    >
      <span className="capitalize">{sortValue}</span>
      {isOpen ? <span>&#9650;</span> : <span>&#9660;</span>}
      {isOpen ? (
        <List
          onClick={updateUrlParams}
          state={sortValue}
          closeModal={() => setIsOpen(false)}
          filterProps={filterProps} // Pass the filter options to the list component
        />
      ) : null}
    </button>
  );
}

type ListProps = {
  state: string;
  onClick: (value: string) => void;
  closeModal: () => void;
  filterProps: any[]; // Array of filter options to display in the list (default is ['All', 'Customer', 'Contractor'])
};

function List({ state, onClick, closeModal, filterProps }: ListProps) {
  function handleSelect(text: string) {
    onClick(text);
    closeModal(); // Close the modal when a filter is selected
  }
  return (
    <ul className="absolute text-xs font-medium border border-gray-400 rounded-sm  focus:ring-0  outline-none w-28 left-0 top-14 bg-white shadow-2xl transition-all duration-500 z-30">
      {filterProps.map((filterProp) => (
        <li
          className={`${
            state.toLowerCase().includes(filterProp.toLowerCase())
              ? "bg-black text-white"
              : "bg-white text-black"
          } w-full mb-2 p-2 hover:bg-black hover:text-white cursor-pointer transition-all duration-300 text-start`}
          key={filterProp}
          onClick={() => handleSelect(filterProp)}
        >
          {filterProp}
        </li>
      ))}
    </ul>
  );
}
