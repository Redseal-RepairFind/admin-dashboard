import Pagination from "@/components/shared/pagination";
import Table from "../shared/table/components/table";
import TableCard from "../shared/table/components/table-card";
import TableOverflow from "../shared/table/components/table-overflow";
import Thead from "../shared/table/components/thead";
import Th from "../shared/table/components/th";
import Td from "../shared/table/components/td";
import { formatCurrency } from "@/lib/utils/curencyConverter";
import { formatDateToDDMMYY } from "@/lib/utils/format-date";

const table_headers = [
  "Name",
  "Email",
  "Amount",
  "Payout status",
  "No. of earnings",
  "Date",
];

const EliteCustomersTable = ({ data }: { data: any }) => {
  // console.log(data);

  const pageProps = {
    data: data?.pagination,
  };
  return (
    <TableCard>
      <TableOverflow>
        <Table>
          <Thead>
            <tr>
              {table_headers?.map((heading, index) => (
                <Th key={index}>{heading}</Th>
              ))}
            </tr>
          </Thead>
          <tbody>
            {data?.payouts?.map((item: any) => (
              <tr key={item._id} className="cursor-pointer">
                <Td>{item?.user?.name}</Td>
                <Td>{item?.user?.email}</Td>
                <Td>{formatCurrency(item?.totalEarnings || 0)}</Td>
                <Td>{item?.payoutStatus}</Td>
                <Td>{item?.earnings?.length}</Td>
                <Td>{formatDateToDDMMYY(item?.updatedAt)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
      <div className="w-full mt-2">
        {data?.pagination?.totalPages > 1 && <Pagination {...pageProps} />}
      </div>
    </TableCard>
  );
};

export default EliteCustomersTable;
