import React, { useEffect, useState } from "react";
import { getCustomerDetail } from "@/lib/api/api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setSingleCustomersDetail } from "@/lib/redux/slices/single-customer";
import { usePathname, useRouter } from "next/navigation";
import { ICustomerData, ICustomers } from "@/lib/types";
import {
  findCustomersLargestYear,
  findCustomersSmallestYear,
} from "@/lib/utils/get-min-or-max-date";
import { generateRange } from "@/lib/utils/generate-range";
interface UseJobsTableProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCustomersTable = ({ setLoading }: UseJobsTableProps) => {
  const [customers, setCustomers] = useState<ICustomers>();
  const [currentCustomers, setCurrentCustomers] = useState<ICustomers>();
  const [queryedCustomers, setQueryedCustomers] = useState<ICustomers>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getCustomerDetail({ page: 1, limit: 4 }).then((response) => {
      console.log(response);
      setLoading(false);
      setCustomers(response);
    });
  }, []);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentCustomers(customers);
    } else {
      setCurrentCustomers(queryedCustomers);
    }
  }, [isQuerying, customers, queryedCustomers]);

  const dispatch = useAppDispatch();

  const handleViewACustomer = (item: ICustomerData) => {
    setLoading(true);
    dispatch(setSingleCustomersDetail(item));
    router.push(`${pathname}/${item.customer._id}`);
  };

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);
    if (customers) {
      const filterArray = customers.customers.filter(
        (item) =>
          item.customer.email.toLowerCase().includes(value.toLowerCase()) ||
          item.customer.fullName.toLowerCase().includes(value.toLowerCase())
      );

      setQueryedCustomers({ customers: filterArray });

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  useEffect(() => {
    if (customers) {
      const smallestDate = findCustomersSmallestYear(customers.customers);
      const largestDate = findCustomersLargestYear(customers.customers);
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentCustomers]);

  const handleRatingFiltering = (value: number) => {
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (customers) {
      const filteredMatchingRating = customers.customers.filter(
        (item) => item.rating?.avgRating === value
      );

      console.log(filteredMatchingRating);

      setQueryedCustomers({ customers: filteredMatchingRating });
    }
  };

  console.log(queryedCustomers);

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (customers) {
        const customersMatchingYear = customers.customers.filter((customer) => {
          const createdAtDate = new Date(customer.customer.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = createdAtDate.getMonth() + 1;
          return createdAtYear === value && createdAtMonth === filterMonth;
        });
        setQueryedCustomers({ customers: customersMatchingYear });
      }
    } else {
      if (customers) {
        const customersMatchingYear = customers.customers.filter((customer) => {
          const createdAtDate = new Date(customer.customer.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          return createdAtYear === value;
        });
        setQueryedCustomers({ customers: customersMatchingYear });
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (customers) {
        const customersMatchingMonth = customers.customers.filter(
          (customer) => {
            const createdAtDate = new Date(customer.customer.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtMonth === value && createdAtYear === filterYear;
          }
        );
        setQueryedCustomers({ customers: customersMatchingMonth });
      }
    } else {
      if (customers) {
        const customersMatchingMonth = customers.customers.filter(
          (customer) => {
            const createdAtDate = new Date(customer.customer.createdAt);
            const createdAtMonth = createdAtDate.getMonth() + 1;
            console.log(createdAtMonth);
            return createdAtMonth === value;
          }
        );
        setQueryedCustomers({ customers: customersMatchingMonth });
      }
    }
  };

  return {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleRatingFiltering,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentCustomers,
    handleViewACustomer,
  };
};
