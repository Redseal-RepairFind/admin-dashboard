"use client";

import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import TableCard from "@/features/shared/table/components/table-card";
import Pagination from "@/components/shared/pagination";
import Header from "../layout/header/header";
import { useModerations } from "@/lib/hooks/useModerations";
import LoadingTemplate from "../layout/loading";
import VerticalMenu from "@/components/shared/vertical-menu";
import { useRef, useState } from "react";
import Modal from "react-responsive-modal";
import Image from "next/image";
import SubmitBtn from "@/components/ui/submit-btn";
import { Column } from "../appVersion/mutateVersionForm";
import toast from "react-hot-toast";

const theader = [
  "Uploader's Name",
  "App",
  "Status",
  // "Verdict",
  "Moderator",
  "Mod's comment",
  "Action",
];

const FileMod = () => {
  return (
    <PageBody>
      <Header />

      <div className="my-6">
        <PageHeading page_title="File Moderations" />
      </div>

      <ModTable />
    </PageBody>
  );
};

export default FileMod;

const ModTable = () => {
  const {
    moderateImg,
    moderationsData,
    isLoadingModerationsData,
    isRefetchingMods,
    refetchMode,
  } = useModerations();

  const modData = moderationsData?.data?.data?.data;
  // console.log(modData);

  const pageProps = {
    data: moderationsData?.data?.data,
  };

  const [modal, setModal] = useState<{
    openView: boolean;
    openApprove: boolean;
    comment: string;
    personalInfo: boolean;
    explicitContent: boolean;
    item: any;
  }>({
    openView: false,
    openApprove: false,
    comment: "",
    personalInfo: false,
    explicitContent: false,
    item: null,
  });

  const rowOptions = [
    {
      name: "View Media",
      action: (item: any) =>
        setModal((prev) => ({
          ...prev,
          item,
          openView: true,
        })),
    },
  ];

  const handleSubmit = async () => {
    toast.loading("Verifying.. .. .. .. ");
    try {
      await moderateImg({
        id: modal.item?._id,
        payload: {
          comment: modal.comment,
          containsPII: modal.personalInfo,
          containsExplicitContent: modal.explicitContent,
        },
      });

      toast.remove();
      toast.success("File Verified successfully");

      setModal({
        openApprove: false,
        openView: false,
        comment: "",
        explicitContent: false,
        personalInfo: false,
        item: null,
      });
      refetchMode();
      // console.log(modal);
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(error?.response?.data?.message || "File verification failed");
    }
  };

  const modalRef = useRef(null);

  return (
    <TableCard>
      {isLoadingModerationsData || isRefetchingMods ? (
        <LoadingTemplate />
      ) : (
        <TableOverflow>
          <Modal
            open={modal.openApprove}
            onClose={() =>
              setModal((prev) => ({
                ...prev,
                openApprove: false,
              }))
            }
            center
            classNames={{
              modal: "customModal",
            }}
            container={modalRef.current}
          >
            <div className="w-[500px] min-h-[400px] p-4 flex flex-col gap-5">
              <Column>
                <p>Comment</p>
                <textarea
                  rows={4}
                  cols={5}
                  value={modal.comment}
                  className="h-24 w-full border p-3 rounded-lg"
                  onChange={(e) =>
                    setModal((prev) => ({
                      ...prev,
                      comment: e?.target?.value,
                    }))
                  }
                  placeholder="Enter your findings about this file here"
                />
              </Column>

              <Column>
                <p>Does file have personal info?</p>
                <select
                  name="containsPII"
                  id="1"
                  className="border w-full h-12 rounded-lg"
                  onChange={(e) =>
                    setModal((prev) => ({
                      ...prev,
                      personalInfo: e?.target?.value === "true",
                    }))
                  }
                >
                  <option value="select">-Select-</option>
                  <option value="true">YES</option>
                  <option value="false">NO</option>
                </select>
              </Column>
              <Column>
                <p>Does file contain explicit content?</p>
                <select
                  name="containsExplicitContent"
                  id="2"
                  className="border w-full h-12 rounded-lg"
                  onChange={(e) =>
                    setModal((prev) => ({
                      ...prev,
                      explicitContent: e?.target?.value === "true",
                    }))
                  }
                >
                  <option value="select">-Select-</option>
                  <option value="true">YES</option>
                  <option value="false">NO</option>
                </select>
              </Column>

              <div className="flex items-center justify-between">
                <SubmitBtn isSubmitting={false} onClick={handleSubmit}>
                  Proceed
                </SubmitBtn>
              </div>
            </div>
          </Modal>
          <Modal
            open={modal.openView}
            onClose={() =>
              setModal((prev) => ({
                ...prev,
                openView: false,
              }))
            }
            center
            classNames={{
              modal: "customModal",
            }}
            container={modalRef.current}
          >
            <div className="p-3 h-[500px] flex flex-col justify-between">
              <div className="w-[600px] h-[300px]  mb-4">
                {modal?.item?.url?.toLowerCase()?.includes("mp4") ||
                modal?.item?.url?.toLowerCase()?.includes("mov") ? (
                  <video
                    src={modal?.item?.url}
                    controls
                    className="w-full h-full rounded-lg"
                    autoPlay
                  >
                    Your browser does not support the video tag
                  </video>
                ) : (
                  <Image src={modal?.item?.url} alt="Image" fill />
                )}
              </div>
              {modal?.item?.isModerated ? null : (
                <SubmitBtn
                  isSubmitting={false}
                  onClick={() =>
                    setModal((prev) => ({
                      ...prev,
                      openApprove: true,
                      openView: false,
                    }))
                  }
                >
                  Verify file
                </SubmitBtn>
              )}
            </div>
          </Modal>
          <Table>
            <Thead>
              <tr>
                {theader?.map((heading, index) => (
                  <Th key={index}>{heading}</Th>
                ))}
              </tr>
            </Thead>
            {modData?.map((mod: any) => (
              <tbody
                className="border-b border-gray-100 cursor-pointer hover:bg-slate-200 transition-all duration-300"
                key={mod?._id}
              >
                <Td>
                  {`${mod?.entityId?.firstName} ${mod?.entityId?.lastName}`}
                </Td>
                <Td>{mod?.entity}</Td>
                <Td>{mod?.isModerated ? "Reviewed" : "In Review"}</Td>

                <Td>
                  {mod?.isModerated
                    ? mod?.moderatedBy?.name || "Admin"
                    : "Not reviewed"}
                </Td>
                <Td>{mod?.moderationComment || "Not reviewd yet"}</Td>
                <Td>
                  {/* <VerticalMenu isBackground>
                    
                  </VerticalMenu> */}

                  <div>
                    {rowOptions?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          option?.action(mod);
                        }}
                        className="block w-full border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      >
                        {mod?.isModerated ? "Media verified" : option?.name}
                      </button>
                    ))}
                  </div>
                </Td>
              </tbody>
            ))}
          </Table>
        </TableOverflow>
      )}
      <div className="mt-4 w-full">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
};
