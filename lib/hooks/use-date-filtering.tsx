// import {useState} from 'react'
// import { ICustomers } from '../types';
// const [filterYear, setFilterYear] = useState(0);
//   const [filterMonth, setFilterMonth] = useState(0);
//   const [isQuerying, setIsQuerying] = useState(false);
//   const [customers, setCustomers] = useState<ICustomers>();
//   const [currentCustomers, setCurrentCustomers] = useState<ICustomers>();
//   const [queryedCustomers, setQueryedCustomers] = useState<ICustomers>();

// const handleYearFiltering = (value: number) => {
//     setFilterYear(value);
//     value === 0 ? setIsQuerying(false) : setIsQuerying(true);
//     if (filterMonth !== 0) {
//       if (customers) {
//         const customersMatchingYear = customers.customers.filter((customer) => {
//           const createdAtDate = new Date(customer.createdAt);
//           const createdAtYear = createdAtDate.getFullYear();
//           const createdAtMonth = createdAtDate.getMonth() + 1;
//           return createdAtYear === value && createdAtMonth === filterMonth;
//         });
//         setQueryedCustomers({ customers: customersMatchingYear });
//       }
//     } else {
//       if (customers) {
//         const customersMatchingYear = customers.customers.filter((customer) => {
//           const createdAtDate = new Date(customer.createdAt);
//           const createdAtYear = createdAtDate.getFullYear();
//           return createdAtYear === value;
//         });
//         setQueryedCustomers({ customers: customersMatchingYear });
//       }
//     }
//   };

//   const handleMonthFiltering = (value: number) => {

//     setFilterMonth(value);
//     value === 0 ? setIsQuerying(false) : setIsQuerying(true);
//     if (filterYear !== 0) {
//       if (customers) {
//         const customersMatchingMonth = customers.customers.filter(
//           (customer) => {
//             const createdAtDate = new Date(customer.createdAt);
//             const createdAtYear = createdAtDate.getFullYear();
//             const createdAtMonth = createdAtDate.getMonth() + 1;
//             return createdAtMonth === value && createdAtYear === filterYear;
//           }
//         );
//         setQueryedCustomers({ customers: customersMatchingMonth });
//       }
//     } else {
//       if (customers) {
//         const customersMatchingMonth = customers.customers.filter(
//           (customer) => {
//             const createdAtDate = new Date(customer.createdAt);
//             const createdAtMonth = createdAtDate.getMonth() + 1;
//             return createdAtMonth === value;
//           }
//         );
//         setQueryedCustomers({ customers: customersMatchingMonth });
//       }
//     }
//   };
