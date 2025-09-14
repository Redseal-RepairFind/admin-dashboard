"use client";
import TableOverflow from "@/features/shared/table/components/table-overflow";
import Table from "@/features/shared/table/components/table";
import Thead from "@/features/shared/table/components/thead";
import Th from "@/features/shared/table/components/th";
import Td from "@/features/shared/table/components/td";

import Heading from "../shared/table/components/table-heading";

const table_heading = ["Strike ID", "Job ID", "Issue Date", "Reason"];

function SanctionCard({
  offender,
  data,
  handleStrike,
}: {
  offender: string;
  data: any;
  handleStrike: any;
}) {
  return (
    <div className="bg-[#f8f8f8] w-[800px]  p-5">
      <Heading name={"Sanction"} />

      <div className="rounded-md py-8 bg-white p-4">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold capitalize">
            {offender}:
            {`${data?.reported?.firstName} ${data?.reported?.lastName}`}
          </h2>

          <span className="bg-[#ffd6d6] text-[#dc2525] rounded-[28px] text-[12px] px-2 py-2">
            Total strikes {data?.reported?.sanctions?.length} of 3
          </span>
        </div>

        <TableOverflow>
          <Table>
            <Thead>
              <tr>
                {table_heading.map((heading, index) => (
                  <Th key={index}>{heading}</Th>
                ))}
              </tr>
            </Thead>
            {/* <tbody>
              {data.map((row, index) => (
                <Tr key={index}>
                  <Td>{row.strikeId}</Td>
                  <Td>{row.jobId}</Td>
                  <Td>{row.issueDate}</Td>
                  <Td>{row.reason}</Td>
                </Tr>
              ))}
            </tbody> */}
          </Table>
        </TableOverflow>
      </div>

      <button
        className="px-8 py-3 bg-[#dd0a0a] text-white rounded-md hover:text-[#dd0404] hover:border hover:bg-white hover:border-[#dd0404] duration-500 transition-all mt-8"
        onClick={handleStrike}
      >
        Issue {offender} a strike
      </button>
    </div>
  );
}

export default SanctionCard;
