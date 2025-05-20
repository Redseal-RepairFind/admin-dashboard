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
import { useEffect, useRef, useState } from "react";
import Modal from "react-responsive-modal";

import Form from "./push-form";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import PushCampaign from "./push-campaign";
import InboxCampaign from "./inbox-campaign";

export const table_headings = [
  "Title",
  "Message",
  "StartDate",
  "Recurring",
  "Frequency",
  "Intervals",
  "Status",
  "Action",
];

const types = [
  { id: 1, value: "All", slug: "ALL" },
  { id: 3, value: "Push Campaign", slug: "PUSH" },
  { id: 2, value: "Inbox Campaign", slug: "INBOX" },
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

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("PUSH");

  const router = useRouter();
  const pathname = usePathname();
  const param = useSearchParams();

  const initialString = param.get("channels");
  const initialSortValue = param.get("channels")?.replace(/_/g, " ") || "All";

  const [sortValue, setSortValue] = useState(initialSortValue);

  useEffect(() => {
    const sortFromParam = param.get("channels");
    if (sortFromParam) {
      const updatedSortValue = sortFromParam.replace(/_/g, " ");
      setSortValue(updatedSortValue);
    }
  }, [param]);

  function updateUrlParams(value: string) {
    const formattedValue = value.replace(/ /g, "_").toLowerCase();

    if (value === "ALL") {
      router.replace(`${pathname}`, {
        scroll: false,
      });
    } else {
      const params = new URLSearchParams(window.location.search);
      params.set("channels", formattedValue);
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    }

    setSortValue(value);
    setStatus(value);
  }

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

  // const dataToRender = pushCampaigns?.data?.data?.data;

  // console.log(dataToRender);

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
          <PageHeading page_title={"Marketing Campaigns"} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-5 bg-white px-4 py-3 rounded-t-md">
            {types.map((type: any, index: number) => (
              <button
                className={
                  sortValue.toLowerCase() === type?.slug.toLowerCase()
                    ? "font-semibold border-b-2 border-black"
                    : "text-gray-400"
                }
                onClick={() => {
                  // sessionStorage.setItem("session_dispute_status", type.slug);
                  updateUrlParams(type.slug);
                }}
                key={index}
              >
                {type.value.includes("Reviewed") ? "Ongoing" : type.value}
              </button>
            ))}
          </div>
        </div>

        {sortValue.toLowerCase() === "inbox" ? (
          <InboxCampaign />
        ) : (
          <PushCampaign />
        )}
      </PageBody>
    </>
  );
};

export default PushNotification;
