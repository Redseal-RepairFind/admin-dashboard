import React from "react";
import TableCard from "./components/table-card";
import Heading from "./components/table-heading";
import Searchbar from "./components/searchbar";
import Filter from "./components/filter";
import Paginator from "./components/paginator";
import TableOverflow from "./components/table-overflow";
import Table from "./components/table";
import Thead from "./components/thead";
import Th from "./components/th";
import Td from "./components/td";

// Since the table data is dynamic a table component will replace by this template
// This Template defines how you can implement any table on your page

const table_headings = [
  "Customer’s Name",
  "Invoice ID",
  "Contractors’s Name",
  "Job Address",
  "Date",
  "Quote",
  "Status",
  "Action",
];

const table_data = [
  {
    customers_name: "Customer’s Name",
    id: "Invoice ID",
    contractors_name: "Contractors’s Name",
    job_address: "Job Address",
    date: "Date",
    quote: "Quote",
    status: "Completed",
  },
  {
    customers_name: "Customer’s Name",
    id: "Invoice ID",
    contractors_name: "Contractors’s Name",
    job_address: "Job Address",
    date: "Date",
    quote: "Quote",
    status: "Complaints",
  },
  {
    customers_name: "Customer’s Name",
    id: "Invoice ID",
    contractors_name: "Contractors’s Name",
    job_address: "Job Address",
    date: "Date",
    quote: "Quote",
    status: "Pending",
  },
  {
    customers_name: "Customer’s Name",
    id: "Invoice ID",
    contractors_name: "Contractors’s Name",
    job_address: "Job Address",
    date: "Date",
    quote: "Quote",
    status: "Pending",
  },
];

const TableTemplate = () => {
  return (
    <TableCard>
      <div className="flex items-center justify-between w-full">
        <Heading name="Job List" />
        <div className="flex gap-8">
          <Searchbar />
          {/* <Filter /> */}
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

          <tbody>
            {table_data?.map((data, index) => (
              <tr key={index}>
                {Object.keys(data).map((item, idx) => (
                  <Td key={idx}>
                    {/* Typescript assertion of key from object dot keys method */}
                    {data[item as keyof typeof data]}
                  </Td>
                ))}
                <Td>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"
                      fill="#555555"
                    />
                  </svg>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableOverflow>
      {/* <Paginator /> */}
    </TableCard>
  );
};

export default TableTemplate;
