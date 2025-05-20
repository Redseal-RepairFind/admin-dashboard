import Modal from "react-responsive-modal";
import Form from "./push-form";
import { useRef, useState } from "react";
import { useNotifsCampaign } from "@/lib/hooks/useNotifCampaigns";
import LoadingTemplate from "../layout/loading";
import TableCard from "../shared/table/components/table-card";
import { SubmitBtn } from "../quiz/components";
import TableOverflow from "../shared/table/components/table-overflow";
import Table from "../shared/table/components/table";
import Thead from "../shared/table/components/thead";
import Td from "../shared/table/components/td";
import Th from "../shared/table/components/th";
import { formatTimeDDMMYY } from "@/lib/utils/format-date";
import VerticalMenu from "@/components/shared/vertical-menu";
import Pagination from "@/components/shared/pagination";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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

const InboxCampaign = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openPush, setOpenPush] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [item, setItem] = useState<any>(null);
  const modalRef = useRef();

  const router = useRouter();
  const pathname = usePathname();
  const {
    isLoadingPushCamp,
    pushCampaigns,
    isLoadingSegments,
    campaignData,
    deleteCampaign,
    refetchPushCamps,
  } = useNotifsCampaign();

  const dataToRender = pushCampaigns?.data?.data?.data;
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
    {
      name: "View report",
      action: (item: any) => {
        //  setOpenTeamsForm({ ...openTeamsForm, editInfo: true });
        //  setItem(item);
        router.push(`${pathname}/${item?._id}`);
      },
    },
    {
      name: "Delete",
      action: (item: any) => {
        //  setOpenTeamsForm({ ...openTeamsForm, editInfo: true });
        setOpenModal(true);
        setItem(item);
      },
    },
  ];

  const handleDelete = async () => {
    try {
      toast.loading("Deleting Campaign...");

      const deleteItem = await deleteCampaign(item?._id);

      toast.remove();
      toast.success(deleteItem?.message || "Campaign deleted successfully...");

      setOpenModal(false);
      refetchPushCamps();
    } catch (error: any) {
      console.error(error);
      toast.remove();
      toast.error(
        error?.response?.data?.message || "Campaign deletion failed...."
      );
    }
  };

  if (isLoadingPushCamp || isLoadingSegments) return <LoadingTemplate />;

  return (
    <>
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
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={modalRef.current}
      >
        <div className="w-[400px] max-h-[700px] overflow-y-auto pt-6">
          <h2 className="text-xl mb-4 font-bold text-center">
            Are you sure you want to delete this campaign?
          </h2>

          <p className="text-center">This action can not be un done</p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <button
              className="py-2 px-4 border rounded-md w-full"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </button>
            <SubmitBtn shade="danger" onClick={handleDelete}>
              Proceed
            </SubmitBtn>
          </div>
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
      <TableCard>
        <div className=" flex justify-between">
          <div className="flex items-center gap-4">
            <SubmitBtn onClick={() => setOpenMessage(true)}>
              Send Inbox message
            </SubmitBtn>
          </div>
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
              {campaignData?.map((data: any) => (
                <tr key={data?._id} className="border-b border-gray-100">
                  <Td>{data?.title}</Td>
                  <Td>
                    <span className="max-w-[100px] text-[12px]">
                      {data?.message}
                    </span>
                  </Td>
                  <Td>
                    {formatTimeDDMMYY(data?.schedule?.startDate || new Date())}
                  </Td>
                  <Td>{data?.schedule?.recurring ? "True" : "False"}</Td>
                  <Td>{data?.schedule?.frequency || "One time"}</Td>
                  <Td>{data?.schedule?.interval || 0}</Td>
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
    </>
  );
};

export default InboxCampaign;
