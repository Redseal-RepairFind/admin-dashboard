// app/components/DownloadPDFButton.tsx
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import ContractorsTablePDF from "./tablePdf";

const DownloadPDFButton = ({
  data,
  headers,
  name,
  rowMapper,
  close,
  size,
}: {
  data: any[];
  headers: string[];
  name: string;
  rowMapper: any;
  close: () => void;
  size?: "A1" | "A2" | "A3" | "A4";
}) => {
  return (
    <PDFDownloadLink
      document={
        <ContractorsTablePDF
          data={data}
          headers={headers}
          rowMapper={rowMapper}
          size={size}
        />
      }
      fileName={name}
      className="border text-white bg-black items-center justify-center py-2 px-5"
      onClick={close}
    >
      Export to PDF
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton;
