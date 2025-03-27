import VerticalMenu from "@/components/shared/vertical-menu";
import SubmitBtn from "@/components/ui/submit-btn";
import LoadingTemplate from "@/features/layout/loading";
import Heading from "@/features/shared/table/components/table-heading";
import useCustomise from "@/lib/hooks/useCustomise";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEllipsisV } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Modal from "react-responsive-modal";

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

      <div>
        <button
          className="bg-gray-800 text-gray-50 py-2 px-4 rounded-sm"
          onClick={() => setOpenModal({ ...openModal, create: true })}
        >
          Create new Question
        </button>
      </div>
      {faqs?.data?.map((faq: any, i: number) => (
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
  const { register, handleSubmit } = useForm();
  const { updateFAQ, refetchFaqs, createFAQ, isEditing, isCreating } =
    useCustomise();

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
          {...register("question", { required: "Enter ba valid question" })}
          className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
          defaultValue={type === "edit" ? editData?.question : ""}
        />
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
      </div>

      <div className="flex items-center justify-between">
        <SubmitBtn isSubmitting={isCreating || isEditing}>Submit</SubmitBtn>
      </div>
    </form>
  );
};
