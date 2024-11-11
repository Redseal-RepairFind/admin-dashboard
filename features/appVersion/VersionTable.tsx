"use client";

import Search from "@/components/shared/search";
import TableCard from "../shared/table/components/table-card";
import LoadingTemplate from "../layout/loading";
import TableOverflow from "../shared/table/components/table-overflow";
import Table from "../shared/table/components/table";
import Thead from "../shared/table/components/thead";
import Th from "../shared/table/components/th";
import Pagination from "@/components/shared/pagination";
import Td from "../shared/table/components/td";
import useAppVersion from "./hooks/useAppVersion";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import SortLists from "@/app/_components/Sort";
import ActionButton from "../shared/inner-pages/action-button";
import SubmitBtn from "@/components/ui/submit-btn";
import { useRef, useState } from "react";
import { Modal } from "react-responsive-modal";
import Form from "./mutateVersionForm";

const table_headings = [
  "App Name",
  "Platform",
  "Version",
  "Release Date",
  "Latest Version",
  "Status",
];

const sortProps = [
  {
    url: "all",
    render: "ALL",
  },
  {
    url: "ios",
    render: "IOS",
  },
  {
    url: "android",
    render: "ANDROID",
  },
];

function VersionTable() {
  const {
    isLoading,
    dataToRender,
    handleNavigation,
    handleCreateVersion,
    isCreating,
  } = useAppVersion();
  const createRef = useRef();

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);

  const handleCloseModal = () => setModalOpen(false);

  // console.log(appData);

  const pageProps = {
    data: dataToRender,
  };

  return (
    <TableCard>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        classNames={{
          modal: "customModal",
        }}
        container={createRef.current}
      >
        <Form
          type="create"
          handleSubmit={handleCreateVersion}
          formstate={isCreating}
          closeModal={handleCloseModal}
        />
      </Modal>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between w-full gap-5">
          <h1 className="text-lg font-semibold ">App Versions List</h1>
          <SortLists sortProps={sortProps} initialState="All" />
          <div className="w-[200px]">
            <SubmitBtn isSubmitting={isCreating} onClick={handleOpenModal}>
              Add a new version
            </SubmitBtn>
          </div>
        </div>
        {/* <Search
          search={search}
          setSearch={handleQuery}
          placeholder="Search..."
          setIsQuerying={setIsQuerying}
        /> */}
      </div>
      {isLoading ? (
        <LoadingTemplate />
      ) : (
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
              {dataToRender?.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 cursor-pointer hover:bg-slate-200 transition-all duration-300"
                  onClick={() => handleNavigation(item?._id)}
                >
                  <Td>{item?.app + " " + "App"}</Td>
                  <Td>{item?.type}</Td>
                  <Td>{item?.version}</Td>
                  <Td>{formatDateToDDMMYY(item?.createdAt)}</Td>
                  <Td>{item?.isCurrent ? "True" : "False"}</Td>
                  <Td>{item?.status}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableOverflow>
      )}
      <div className="w-full mt-2">
        <Pagination {...pageProps} />
      </div>
    </TableCard>
  );
}

export default VersionTable;
