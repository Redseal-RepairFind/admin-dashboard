"use client";

import { useNotifsCampaign } from "@/lib/hooks/useNotifCampaigns";
import Header from "../layout/header/header";
import { SubmitBtn } from "../quiz/components";
import PageBody from "../shared/page-body/page-body";
import PageHeading from "../shared/page-body/page-heading";
import Table from "../shared/table/components/table";
import TableCard from "../shared/table/components/table-card";
import TableOverflow from "../shared/table/components/table-overflow";
import Th from "../shared/table/components/th";
import Thead from "../shared/table/components/thead";
import LoadingTemplate from "../layout/loading";
import Pagination from "@/components/shared/pagination";
import Td from "../shared/table/components/td";
import { formatTimeDDMMYY } from "@/lib/utils/format-date";
import VerticalMenu from "@/components/shared/vertical-menu";
import { useRef, useState } from "react";
import Modal from "react-responsive-modal";

import Form from "./push-form";

const table_headings = [
  "Title",
  "Message",
  "StartDate",
  "Recurring",
  "Frequency",
  "Intervals",
  "Status",
  "Action",
];

const PushNotification = () => {
  const { isLoadingPushCamp, pushCampaigns, isLoadingSegments } =
    useNotifsCampaign();
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openPush, setOpenPush] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [item, setItem] = useState(null);
  const modalRef = useRef();

  const pageProps = {
    data: pushCampaigns?.data?.data,
  };

  let rowOptions = [
    {
      name: "Edit Campaign",
      action: (item: any) => {
        setOpenModalEdit(true);
        setItem(item);
      },
    },
    // {
    //   name: "Edit Campaign",
    //   action: (item: any) => {
    //     //  setOpenTeamsForm({ ...openTeamsForm, editInfo: true });
    //     //  setItem(item);
    //   },
    // },
  ];

  const dataToRender = pushCampaigns?.data?.data?.data;

  if (isLoadingPushCamp || isLoadingSegments) return <LoadingTemplate />;
  return (
    <>
      <Modal
        open={openPush}
        onClose={() => setOpenPush(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[700px] max-h-[700px] overflow-y-auto pt-6">
          <h2 className="text-xl mb-4 font-bold">Send Push Notification</h2>
          <Form type="push" close={() => setOpenPush(false)} />
        </div>
      </Modal>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[700px] max-h-[700px] overflow-y-auto pt-6">
          <h2 className="text-xl mb-4 font-bold">Create Campaign</h2>
          <Form type="new" close={() => setOpenModal(false)} />
        </div>
      </Modal>
      <Modal
        open={openModalEdit}
        onClose={() => setOpenModalEdit(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[700px] max-h-[700px] overflow-y-auto pt-6">
          <h2 className="text-xl mb-4 font-bold">Edit Campaign</h2>

          <Form
            type="edit"
            editData={item}
            close={() => setOpenModalEdit(false)}
          />
        </div>
      </Modal>
      <Modal
        open={openMessage}
        onClose={() => setOpenMessage(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[700px] max-h-[700px] overflow-y-auto pt-6">
          <h2 className="text-xl mb-4 font-bold">Send Message</h2>

          <Form type="message" close={() => setOpenMessage(false)} />
        </div>
      </Modal>
      <Header />
      <PageBody>
        <div className="flex justify-between items-center gap-5 mb-6">
          <PageHeading page_title={"Push Notification Campaigns"} />
        </div>

        <TableCard>
          <div className=" flex justify-between">
            <div className="flex items-center gap-4">
              <SubmitBtn onClick={() => setOpenMessage(true)}>
                Send Inbox message
              </SubmitBtn>
              <button
                className="py-2 px-4 border border-gray-800 rounded-lg"
                onClick={() => setOpenPush(true)}
              >
                Send Push Notification
              </button>
            </div>
            <SubmitBtn onClick={() => setOpenModal(true)}>
              Create new Campaign
            </SubmitBtn>
          </div>
          <TableOverflow>
            <Table>
              <Thead>
                <tr>
                  {table_headings?.map((heading, index) => (
                    <Th key={index}>{heading}</Th>
                  ))}
                </tr>
              </Thead>

              <tbody>
                {dataToRender?.map((data: any) => (
                  <tr key={data?._id} className="border-b border-gray-100">
                    <Td>{data?.title}</Td>
                    <Td>
                      <span className="max-w-[100px] text-[12px]">
                        {data?.message}
                      </span>
                    </Td>
                    <Td>
                      {formatTimeDDMMYY(
                        data?.schedule?.startDate || new Date()
                      )}
                    </Td>
                    <Td>{data?.schedule?.recurring ? "True" : "False"}</Td>
                    <Td>{data?.schedule?.frequency}</Td>
                    <Td>{data?.schedule?.interval}</Td>
                    <Td>{data?.status}</Td>
                    <Td className="z-0">
                      <div className="relative w-fit z-50 overflow-visible">
                        <VerticalMenu
                          isBackground={true}
                          width=""
                          className="relative z-50"
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            {rowOptions?.map((option, index) => (
                              <button
                                key={index}
                                onClick={() => option?.action(data)}
                                className="block  border border-slate-100 px-4 py-2 text-left bg-white duration-200 text-baseFont text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                              >
                                {option?.name}
                              </button>
                            ))}
                          </div>
                        </VerticalMenu>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableOverflow>
          <div className="w-full mt-2">
            <Pagination {...pageProps} />
          </div>
        </TableCard>
      </PageBody>
    </>
  );
};

export default PushNotification;
