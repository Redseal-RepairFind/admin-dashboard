import Heading from "@/features/shared/table/components/table-heading";

function ExportModal({
  title,
  exportPDF,
  exportExcel,
}: {
  title: string;
  exportPDF: any;
  exportExcel: any; // Assuming exportPDF and exportExcel are functions that handle PDF and Excel exporting, respectively.
}) {
  return (
    <div className="w-[400px]">
      <Heading name={`Export ${title}`} />

      <p className="text-gray-500 my-6">Export to a file of your choosing</p>
      <div className="flex items-center gap-2">
        <button
          className="h-12 w-full bg-black text-white px-2 flex rounded-md items-center justify-center transition-all duration-400 hover:bg-gray-700 hover:text-white "
          onClick={exportPDF}
        >
          Export to PDF
        </button>
        <button
          className="h-12 w-full bg-white border border-gray-700 px-2 rounded-md text-black flex items-center justify-center hover:bg-gray-700 hover:text-white  transition-all duration-400"
          onClick={exportExcel}
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
}

export default ExportModal;
