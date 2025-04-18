"use client";

import Heading from "@/features/shared/table/components/table-heading";
import useAdminPermissions from "@/lib/hooks/useAdminPermissions";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { validate } from "uuid";

function DeleteModal({
  name,
  closeModal,
  onSubmit,
  type,
  title,
  who = "regular",
  ids,
}: {
  name: string;
  closeModal: any;
  onSubmit: any;
  type: string;
  title: string;
  who?: "regular" | "contractor";
  ids?: string[];
}) {
  const [email, setEmail] = useState({ email: "", error: "" });
  const params = useParams();
  const queryClient = useQueryClient();

  const { adminPermissions } = useAdminPermissions();

  const id = params?.slug;
  const router = useRouter();
  const validateEmail = (email: string) => {
    if (!email) {
      setEmail((email) => ({
        ...email,
        error: "Can not be empty",
      }));
      return false;
    } else if (email !== "DELETE") {
      setEmail((email) => ({ ...email, error: "Enter the Correct  word" }));
      return false;
    }
    //
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   setEmail((email) => ({ ...email, error: "Invalid email address" }));
    //   return false;
    // }
    setEmail((email) => ({ ...email, error: "" }));
    return true;
  };

  const handleDelete = async () => {
    // if (!adminPermissions.data.includes("delete_contractor")) {
    //   toast.error("You don't have permission to delete contractors");
    //   return;
    // }
    try {
      toast.loading("Deleting Contractor");
      const payload = { confirmationCode: email.email.toLowerCase() };

      let data;
      if (id) {
        data = await onSubmit({
          id,
          payload,
        });
      }

      if (ids) {
        data = await onSubmit({
          contractorIds: ids,
          confirmationCode: email.email.toLowerCase(),
        });
        queryClient.invalidateQueries("sortData");
      }

      toast.remove();
      toast.success(data.message || "Contractor deleted successfully");
      closeModal("delete");
      router.push(`/contractors`);
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(
        error?.response?.data?.message || "Unable to delete contractor"
      );
      // Handle error here
    }
  };

  async function handleSubmit() {
    if (who === "contractor") {
      if (validateEmail(email.email)) {
        await handleDelete();
      }
    } else {
      onSubmit("delete");
      closeModal("delete");
    }
  }
  return (
    <div className="flex flex-col   gap-4 max-w-[480px] mx-auto">
      <div className="flex items-center justify-center">
        <Heading name={title} />
      </div>
      {/* Confirmation for delete */}
      <p className="text-center">
        {who === "contractor" ? (
          <span className="">
            Kindly confirm by typing the word{" "}
            <span className="py-1 px-2 rounded-sm bg-red-50 font-bold text-red-600">
              DELETE
            </span>{" "}
            to proceed. This action can not be undone
          </span>
        ) : (
          ` Are you sure you want to delete ${name} ${type}?. This action cannot be
        undone.`
        )}
      </p>

      {who === "contractor" && (
        <>
          <input
            type="text "
            placeholder="Enter the word"
            className={`outline py-2 px-4 rounded-md ${
              email.error ? "outline-red-600" : "outline-gray-300"
            }`}
            onChange={(e) => setEmail({ email: e.target.value, error: "" })}
          />
          {email.error && <p className="text-sm text-red-600">{email.error}</p>}
        </>
      )}

      <div className="grid grid-cols-2 gap-2 items-center gap">
        <button
          className="bg-gray-200 h-12 w-full flex items-center rounded-md justify-center text-gray-800"
          onClick={() => {
            closeModal("delete");
          }}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 h-12 w-full flex items-center rounded-md justify-center text-gray-100"
          onClick={() => {
            handleSubmit();
            // closeModal("delete");
          }}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default DeleteModal;
