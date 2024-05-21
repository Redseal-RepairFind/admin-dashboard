"use client";
import { formatTimeDDMMYY } from "@/lib/utils/format-date";
import { trimString } from "@/lib/utils/trim-string";
import { CompletedState, PendingState } from "@/public/svg";
import Image from "next/image";
import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { ITransactionsDetail } from "@/lib/types";

interface IProps {
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
  transactionDetail: ITransactionsDetail;
}

const Reciept: React.FC<IProps> = ({ closeModal, transactionDetail }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = async () => {
    const pdf = new jsPDF("p", "px", "a4");
    const canvas = await html2canvas(componentRef.current as HTMLElement);
    const imgData = canvas.toDataURL("image/png");
    const xPos = (pdf.internal.pageSize.getWidth() - canvas.width * 0.6) / 2;
    const yPos = (pdf.internal.pageSize.getHeight() - canvas.height * 0.6) / 2;
    pdf.addImage(
      imgData,
      "PNG",
      xPos,
      yPos,
      canvas.width * 0.6,
      canvas.height * 0.6
    );
    pdf.save("sample.pdf");
  };

  return (
    <div ref={componentRef}>
      {/* Logo */}
      <div>
        <Image
          src="/reciept-logo.svg"
          alt=""
          width={70}
          height={70}
          className="mx-auto"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="absolute top-5 right-5 z-30 cursor-pointer"
          onClick={() => closeModal(false)}
        >
          <path
            d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
            fill="#121212"
          />
        </svg>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-5">
          {/* Invoice Image */}
          {/* <Image src="/wood-table.png" alt="" width={79} height={76} /> */}
          <div className="flex flex-col gap-y-1">
            <p className="font-[600] text-xl uppercase">
              Invoice
              <span className="text-[#417AA1] pl-2">
                {trimString(transactionDetail?.transaction._id, 5)}
              </span>
            </p>

            <p className="text-xs font-[500]">
              {transactionDetail.job.jobTitle}
            </p>
            <p className="text-suscess flex gap-1 items-center">
              {transactionDetail.job.inspection.confirmPayment ? (
                <>
                  <CompletedState /> <span>Paid</span>
                </>
              ) : (
                <>
                  <PendingState /> <span>Pending</span>{" "}
                </>
              )}
            </p>
          </div>
        </div>
        {/* Download Button */}
        <button
          onClick={handlePrint}
          className="border border-[#333333] outline-none bg-transparent flex gap-2 py-2 px-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 17 16"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.72725 10.8315C5.98483 10.5739 6.40245 10.5739 6.66004 10.8315L8.83197 13.0034L11.0039 10.8315C11.2615 10.5739 11.6791 10.5739 11.9367 10.8315C12.1943 11.0891 12.1943 11.5067 11.9367 11.7643L9.29837 14.4026C9.04079 14.6602 8.62316 14.6602 8.36558 14.4026L5.72725 11.7643C5.46966 11.5067 5.46966 11.0891 5.72725 10.8315Z"
              fill="#333333"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.83201 7.34033C9.19629 7.34033 9.49159 7.63564 9.49159 7.99992V13.9362C9.49159 14.3004 9.19629 14.5957 8.83201 14.5957C8.46773 14.5957 8.17242 14.3004 8.17242 13.9362V7.99992C8.17242 7.63564 8.46773 7.34033 8.83201 7.34033Z"
              fill="#333333"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.63398 1.40032C7.53133 1.36805 8.42431 1.53977 9.2457 1.90255C10.0671 2.26534 10.7955 2.80973 11.376 3.49475C11.8446 4.04772 12.2071 4.68069 12.4468 5.36167L12.789 5.36167C13.63 5.36112 14.4499 5.62853 15.1287 6.12512C15.8076 6.62181 16.3107 7.32192 16.5647 8.12387C16.8188 8.92581 16.8107 9.78785 16.5417 10.5849C16.2726 11.3819 15.7566 12.0725 15.0685 12.5564C14.7705 12.7659 14.3591 12.6942 14.1495 12.3963C13.94 12.0983 14.0117 11.6869 14.3097 11.4773C14.7684 11.1547 15.1125 10.6943 15.2918 10.163C15.4712 9.63162 15.4766 9.05693 15.3072 8.5223C15.1378 7.98767 14.8025 7.52093 14.3498 7.1898C13.8972 6.85868 13.3508 6.6804 12.79 6.68084H11.9584C11.6573 6.68084 11.3944 6.47688 11.3195 6.18519C11.1459 5.50871 10.8212 4.88043 10.3696 4.34764C9.9181 3.81484 9.35158 3.39143 8.71272 3.10926C8.07387 2.8271 7.37933 2.69353 6.68139 2.71863C5.98345 2.74373 5.3003 2.92684 4.68336 3.25416C4.06643 3.58149 3.53179 4.04451 3.11969 4.60836C2.7076 5.17221 2.42878 5.8222 2.30424 6.50939C2.1797 7.19659 2.21268 7.90309 2.40069 8.5757C2.58871 9.2483 2.92686 9.8695 3.38968 10.3925C3.63109 10.6653 3.60565 11.0822 3.33285 11.3236C3.06005 11.565 2.6432 11.5395 2.40179 11.2667C1.80672 10.5943 1.37196 9.79561 1.13023 8.93083C0.888496 8.06604 0.846097 7.15769 1.00622 6.27415C1.16634 5.39061 1.52482 4.55491 2.05466 3.82996C2.58449 3.10501 3.27189 2.5097 4.06509 2.08886C4.85829 1.66801 5.73663 1.43259 6.63398 1.40032Z"
              fill="#333333"
            />
          </svg>
          <span className="uppercase text-xs font-[500]">Download</span>
        </button>
      </div>

      <div className="flex justify-between mt-10">
        <div className="">
          <p className="text-xs font-[600] text-[#A7A7A7]">From</p>
          <p className="font-[600]">{transactionDetail.customer?.fullName}</p>
          <p className="text-sm text-[#555]">
            {trimString(transactionDetail.customer?.email || "", 20)}
          </p>
        </div>

        <div className="">
          <p className="text-xs font-[600] text-[#A7A7A7]">To</p>
          <p className="font-[600]">{`${
            transactionDetail.contractor?.firstName || ""
          } ${transactionDetail.contractor?.lastName || ""}`}</p>
          <p className="text-sm text-[#555]">
            {trimString(transactionDetail.contractor?.email || "", 20)}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <div>
          <p className="text-sm font-[500] text-[#7B7B7B]">Estimate</p>
          <p>${transactionDetail.job.totalAmountContractorWithdraw}</p>
        </div>
        <div>
          <p className="text-sm font-[500] text-[#7B7B7B]">Due Date</p>
          <p>{formatTimeDDMMYY(transactionDetail.job.time)}</p>
        </div>
      </div>

      {/* Summary */}

      <div className="mt-10 mb-6">
        <p className="text-sm font-[600]">Summary</p>

        <table className="text-sm w-full text-left mt-5">
          <thead>
            <tr className="bg-[#F1F1F1]">
              <th className="font-[500] py-3 px-4">Materials</th>
              <th className="font-[500] py-3 px-4">Rate</th>
              <th className="font-[500] py-3 px-4">Quantity</th>
              <th className="font-[500] py-3 px-4">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactionDetail.job.quate.map((item, index) => (
              <tr key={item._id}>
                <td className="text-sm py-3 px-4 capitalize">
                  {item.material}
                </td>
                <td className="text-sm py-3 px-4">{item.rate}</td>
                <td className="text-sm py-3 px-4">{item.qty}</td>
                <td className="text-sm py-3 px-4">{item.amount}</td>
              </tr>
            ))}

            <tr>
              <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4">Subtotal</td>
              <td className="text-sm py-3 px-4">
                {transactionDetail.job.totalQuatation}
              </td>
            </tr>
            <tr>
              {/* <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4">Quantity</td>
              <td className="text-sm py-3 px-4"></td> */}
            </tr>
            <tr>
              <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4">GST</td>
              <td className="text-sm py-3 px-4">{transactionDetail.job.gst}</td>
            </tr>
            <tr>
              <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4"></td>
              <td className="text-sm py-3 px-4">Total</td>
              <td className="text-sm py-3 px-4">
                {transactionDetail.job.totalAmountCustomerToPaid}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reciept;
