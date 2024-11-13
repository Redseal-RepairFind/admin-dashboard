"use client";

import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import GoBack from "../shared/go-back-button/go-back";
import ActionButton from "../shared/inner-pages/action-button";
import ActionColumn from "../shared/inner-pages/action-column";
import BorderRectangle from "../shared/inner-pages/bordered-rect";
import SingleLineColumn from "../shared/inner-pages/single-line-column";
import Wrapper from "../shared/inner-pages/wrapper";
import useAppVersion from "./hooks/useAppVersion";
import LoadingTemplate from "../layout/loading";
import SubmitBtn from "@/components/ui/submit-btn";
import { useRef, useState } from "react";
import Modal from "react-responsive-modal";
import Form from "./mutateVersionForm";
import DeleteModal from "../customise/components/promotions/DeleteModal";

function SingleVersion() {
  const {
    singleVersion,
    isLoadingSingleVersion,
    handleDelete,
    handleEditVersion,
    isEditing,
  } = useAppVersion();

  const version = singleVersion?.data;
  const [modalOpen, setModalOpen] = useState({
    edit: {
      isOpen: false,
    },
    delete: {
      isOpen: false,
    },
  });

  const handleOpenModal = (type: "delete" | "edit") => {
    setModalOpen((prev) => ({
      ...prev,
      [type]: {
        isOpen: true,
      },
    }));
  };

  const handleCloseModal = (type: "delete" | "edit") => {
    setModalOpen((prev) => ({
      ...prev,
      [type]: {
        isOpen: false,
      },
    }));
  };

  const editRef = useRef();
  const deleteRef = useRef();

  async function deleteFn(id: string) {
    await handleDelete(id);

    handleCloseModal("delete");
  }

  return (
    <Wrapper>
      {isLoadingSingleVersion ? (
        <LoadingTemplate />
      ) : (
        <>
          <div className="my-8">
            <Modal
              open={modalOpen?.edit?.isOpen}
              onClose={() => handleCloseModal("edit")}
              classNames={{
                modal: "customModal",
              }}
              container={deleteRef.current}
            >
              <Form
                type="edit"
                handleSubmit={handleEditVersion}
                formstate={isEditing}
                closeModal={() => handleCloseModal("edit")}
                id={version?._id}
                data={version}
              />
            </Modal>

            <Modal
              open={modalOpen?.delete?.isOpen}
              onClose={() => handleCloseModal("delete")}
              classNames={{
                modal: "customModal",
              }}
              container={editRef.current}
            >
              <DeleteModal
                name={`${version?.app} App`}
                closeModal={handleCloseModal}
                onSubmit={() => deleteFn(version?._id)}
                type={`version ${version?.version}`}
                title={`Delete ${version?.app} App, version ${version?.version}`}
              />
            </Modal>
            <GoBack />
          </div>
          <div className="">
            <BorderRectangle>
              <table className="w-full">
                <tbody>
                  <SingleLineColumn
                    name="App Name"
                    value={version?.app + "  " + "App" || ""}
                  />
                  <SingleLineColumn name="Version" value={version?.version} />
                  <SingleLineColumn name="Platform" value={version?.type} />

                  <SingleLineColumn name="Status" value={version?.status} />
                  <SingleLineColumn
                    name="Current"
                    value={version?.isCurrent ? "True" : "False"}
                    // value=""
                  />
                  <SingleLineColumn
                    name="Release Date"
                    value={formatDateToDDMMYY(version?.createdAt)}
                    // value=""
                  />
                  <ActionColumn>
                    <div className="flex items-center gap-x-4">
                      <div className="w-28">
                        <button
                          className="bg-black h-12 w-full flex items-center rounded-md justify-center px-2 text-gray-100"
                          onClick={() => handleOpenModal("edit")}
                        >
                          Edit Version
                        </button>
                      </div>
                      <div className="flex  gap-x-4">
                        <button
                          className="bg-red-600 h-12 w-full flex items-center rounded-md justify-center px-2 text-gray-100"
                          onClick={() => handleOpenModal("delete")}
                        >
                          Delete Version
                        </button>
                      </div>
                    </div>
                  </ActionColumn>
                </tbody>
              </table>
            </BorderRectangle>
          </div>
        </>
      )}
    </Wrapper>
  );
}

export default SingleVersion;
