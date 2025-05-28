import LoadingTemplate from "@/features/layout/loading";
import DownloadPDFButton from "@/features/shared/table/components/downloadBtn";
import Heading from "@/features/shared/table/components/table-heading";

function ExportModal({
  title,
  exportPDF,
  exportExcel,
  headers,
  data,
  name,
  loading,
  rowMapper,
  close,
  size
}: {
  title: string;
  exportPDF: any;
  exportExcel: any; // Assuming exportPDF and exportExcel are functions that handle PDF and Excel exporting, respectively.
  data: any[];
  headers: string[];
  name: string;
  loading: boolean;
  rowMapper: any;
  close: () => void;
  size?: "A1" | "A2" | "A3" | "A4";
}) {
  return (
    <div className="w-[400px] min-h-[150px]">
      {loading ? (
        <LoadingTemplate />
      ) : (
        <>
          <Heading name={`Export ${title}`} />

          <p className="text-gray-500 my-6">
            Export to a file of your choosing
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* <button
          className="h-12 w-full bg-black text-white px-2 flex rounded-md items-center justify-center transition-all duration-400 hover:bg-gray-700 hover:text-white "
          onClick={exportPDF}
        >
          Export to PDF
        </button> */}
            <button
              className="h-12 w-full bg-white border border-gray-700 px-2 rounded-md text-black flex items-center justify-center hover:bg-gray-700 hover:text-white  transition-all duration-400"
              onClick={exportExcel}
            >
              Export to Excel
            </button>
            <DownloadPDFButton
              headers={headers}
              data={data}
              name={name}
              rowMapper={rowMapper}
              close={close}
              size={size}
            />
            {/* <div></div> */}
          </div>
        </>
      )}
    </div>
  );
}

export default ExportModal;
