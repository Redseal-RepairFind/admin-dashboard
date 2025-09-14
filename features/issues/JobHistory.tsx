import TableCard from "@/features/shared/table/components/table-card";
import Paginator from "@/features/shared/table/components/paginator";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Search from "@/components/shared/search";
import Heading from "../shared/table/components/table-heading";

const table_headings = ["ID", "Job Title", "Date", "Status"];

function JobHistory() {
  return (
    <div className="p-3 rounded-md bg-white  w-full min-h-20 mt-6">
      <div className=" flex gap-2 items-center">
        <Heading name="Job History" />
        <div className="flex w-full p-2.5  gap-1.5">
          <span className="  text-[12px] h-4 gap-1.5 border-r border-r-[#e9e9e9] pr-2">
            Mary j - Customer
          </span>
          <span className=" text-[12px] h-4 items-center flex gap-1.5 border-r">
            Daniel J - Contractor
          </span>
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
          <tbody></tbody>
        </Table>
      </TableOverflow>
    </div>
  );
}

export default JobHistory;
