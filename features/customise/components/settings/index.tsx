import SubmitBtn from "@/components/ui/submit-btn";
import LoadingTemplate from "@/features/layout/loading";
import { Header } from "@/features/quiz/components";
import Heading from "@/features/shared/table/components/table-heading";
import useCustomise from "@/lib/hooks/useCustomise";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEllipsisV } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Modal from "react-responsive-modal";

const Settings = () => {
  const { register, handleSubmit, formState, reset } = useForm();

  const { loadingSettings, settings, updateSettings, refetchSettings } =
    useCustomise();
  const [isDropdown, setIsDropdown] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [currentSetting, setCurrentSetting] = useState<any>();
  const [openModal, setOpenModal] = useState({
    create: false,
    edit: false,
    editValue: "",
  });

  const modalRef = useRef();

  const rowOptions = [
    {
      name: "Edit ",
      action: (item: any) => {
        setOpenModal({ ...openModal, edit: true });
        setCurrentSetting(item);
      },
    },
  ];

  // console.log(currentSetting);

  const dataToRender = settings?.data;

  const onSubmit = async (data: any) => {
    const payload = {
      value:
        typeof currentSetting?.value === "boolean"
          ? data?.value === "true"
            ? true
            : false
          : currentSetting?.name === "app_regions"
          ? [...currentSetting?.value, data?.value]
          : Number(data?.value?.replace("$", "")),
    };
    // console.log(payload);

    toast.loading("Updating Settings...");
    try {
      await updateSettings({ id: currentSetting?._id, payload });

      setOpenModal({ ...openModal, edit: false });
      setCurrentSetting(null);
      reset();
      refetchSettings();
      toast.remove();
      toast.success("Update Successful");
    } catch (error: any) {
      toast.remove();
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  // console.log(dataToRender);
  if (loadingSettings) return <LoadingTemplate />;
  return (
    <div className="flex flex-col  gap-4 max-w-[700px]">
      <Modal
        open={openModal?.edit}
        onClose={() => {
          setOpenModal({ ...openModal, edit: false });
          setOpenMenu(null);
        }}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <form
          className="w-[400px] flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Header
            title={
              currentSetting?.name === "app_regions"
                ? "Add New Region"
                : `Edit ${currentSetting?.name?.replaceAll("_", " ")}`
            }
            size="small"
          />
          {currentSetting?.name === "app_regions" ? (
            <input
              type="text"
              id="question"
              className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
              placeholder="New Region"
              {...register("value", {
                required: "Value is required",
              })}
            />
          ) : typeof currentSetting?.value === "number" ? (
            <input
              type="text"
              id="question"
              className="block w-full border border-gray-200 focus:ring-0 focus:border-black duration-200 rounded-md py-3 px-4 sm:text-sm outline-none"
              defaultValue={`$${currentSetting?.value}`}
              {...register("value", {
                required: "Value is required",
              })}
            />
          ) : (
            <select
              id=""
              className="w-full border border-gray-500 py-3 rounded-md"
              defaultValue={currentSetting?.value === true ? "True" : "False"}
              {...register("value", {
                required: "Value is required",
              })}
            >
              <option value="" disabled>
                -- -- -- --
              </option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}
          {formState?.errors?.value?.message ? (
            <p className="text-red-600">
              {formState?.errors?.value?.message?.toString()}
            </p>
          ) : null}
          <SubmitBtn isSubmitting={false}>
            {currentSetting?.name === "app_regions" ? "Proceed" : "Edit"}
          </SubmitBtn>
        </form>
      </Modal>
      <div className="my-6 ">
        <Heading name="Admin Settings" />
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
                <p className="capitalize text-sm w-full">
                  {faq?.name?.replaceAll("_", " ")}
                </p>
              </div>
              <div>
                {isDropdown === faq?._id ? (
                  <IoMdArrowDropup />
                ) : (
                  <IoMdArrowDropdown />
                )}
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                className="border border-gray-400 bg-gray-400 py-2 px-4 rounded-md text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenu((prevId) =>
                    prevId === faq?._id ? null : faq?._id
                  );
                  reset();
                }}
              >
                <FaEllipsisV />
              </button>

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
            <div className="bg-white px-6 py-2.5 flex flex-col rounded-b-md max-w-[700px] gap-6 ">
              {faq?.name === "app_regions" ? (
                <div className="grid grid-cols-3 gap-4">
                  {faq?.value?.map((item: string, i: number) => (
                    <p key={i}>{item}</p>
                  ))}
                </div>
              ) : (
                <p>
                  Value:{" "}
                  {typeof faq?.value === "number"
                    ? `$${faq?.value}`
                    : faq?.value === true
                    ? "True"
                    : "False"}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Settings;
