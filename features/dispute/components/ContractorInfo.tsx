"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import Img from "./Img";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CustomerChat from "./CustomerChat";
import ContractorChat from "./ContractorChat";

const ContractorInfo = ({ info, title }: { info: any; title: any }) => {
  const [openCustomer, setOpenCustomer] = useState<boolean>(false);
  const customerModalRef = useRef(null);
  const [openContractor, setOpenContractor] = useState<boolean>(false);
  const contractorModalRef = useRef(null);

  return (
    <>
      <Modal
        open={openCustomer}
        onClose={() => setOpenCustomer(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={customerModalRef.current}
      >
        <CustomerChat />
      </Modal>
      <Modal
        open={openContractor}
        onClose={() => setOpenContractor(false)}
        center
        classNames={{
          modal: "customModal",
        }}
        container={contractorModalRef.current}
      >
        <ContractorChat />
      </Modal>

      <div className="p-3 rounded-md bg-white flex items-start justify-between gap-5">
        <div className="bg-gray-100 rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
          <Img url={info?.profilePhoto?.url} />
        </div>
        <div className="flex-1">
          <p className="text-gray-400">{title}</p>
          <p className="font-semibold mt-2">
            {info?.firstName} {info?.lastName}
          </p>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Phone Number: {info?.phoneNumber?.code}
            {info?.phoneNumber?.number}
          </p>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Email: {info?.email}
          </p>
        </div>
        <button
          onClick={() => {
            title === "Customer"
              ? setOpenCustomer(true)
              : setOpenContractor(true);
          }}
          className="border rounded-md border-black bg-black text-white py-2 px-5"
        >
          Chat
        </button>
      </div>
    </>
  );
};

export default ContractorInfo;
