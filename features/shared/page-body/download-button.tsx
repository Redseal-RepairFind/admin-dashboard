import React, { forwardRef } from "react";

interface IProps {
  text: string;
  onClick?: () => void; // Optional onClick prop
}

// Download Button for pages using forwardRef
const DownloadButton = forwardRef<HTMLButtonElement, IProps>(
  ({ text, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className="border border-[#333333] outline-none bg-transparent flex gap-2 py-3 px-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
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
        <span className="uppercase text-xs font-[700]">{text}</span>
      </button>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

export default DownloadButton;
