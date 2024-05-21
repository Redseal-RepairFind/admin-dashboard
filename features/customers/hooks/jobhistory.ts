import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IJob, IJobHistory } from "@/lib/types";
import { generateRange } from "@/lib/utils/generate-range";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setsingleContractorsDetail } from "@/lib/redux/slices/single-contractor";
import { setsingleJobDetail } from "@/lib/redux/slices/single-job-detail";
import { setSingleCustomersJob } from "@/lib/redux/slices/single-customer";

interface IProps {
  jobHistory: IJobHistory[];
}

function findCustomerHistorySmallestYear(arrayOfObjects: IJobHistory[]) {
  console.log(arrayOfObjects);
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let smallestDate = new Date(arrayOfObjects[0].job.createdAt);
  let smallestYear = smallestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].job.createdAt);
    if (currentDate < smallestDate) {
      smallestDate = currentDate;
      smallestYear = currentDate.getFullYear();
    }
  }

  return smallestYear;
}

function findCustomerHistoryLargestYear(arrayOfObjects: IJobHistory[]) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let largestDate = new Date(arrayOfObjects[0].job.createdAt);
  let largestYear = largestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].job.createdAt);
    if (currentDate > largestDate) {
      largestDate = currentDate;
      largestYear = currentDate.getFullYear();
    }
  }

  return largestYear;
}

export const useCustomerHistoryTable = ({ jobHistory }: IProps) => {
  const [currentCustomerHistory, setCurrentCustomerHistory] =
    useState<IJobHistory[]>();
  const [queryedCustomerHistory, setQueryedCustomerHistory] =
    useState<IJobHistory[]>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentCustomerHistory(jobHistory);
      console.log("not querying");
    } else {
      setCurrentCustomerHistory(queryedCustomerHistory);
      console.log("querying");
    }
  }, [isQuerying, jobHistory, queryedCustomerHistory]);

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);
    if (jobHistory) {
      const filterArray = jobHistory.filter(
        (item) =>
          item.job.address.toLowerCase().includes(value.toLowerCase()) ||
          item?.contractor?.firstName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.contractor?.lastName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.job._id.includes(value.toLowerCase())
      );

      setQueryedCustomerHistory(filterArray);

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  useEffect(() => {
    if (jobHistory) {
      const smallestDate = findCustomerHistorySmallestYear(jobHistory);
      const largestDate = findCustomerHistoryLargestYear(jobHistory);
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentCustomerHistory]);

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (currentCustomerHistory) {
        const customerHistoryMatchingYear = currentCustomerHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtYear === value && createdAtMonth === filterMonth;
          }
        );
        setQueryedCustomerHistory(customerHistoryMatchingYear);
      }
    } else {
      if (currentCustomerHistory) {
        const customerHistoryMatchingYear = currentCustomerHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            return createdAtYear === value;
          }
        );
        setQueryedCustomerHistory(customerHistoryMatchingYear);
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (currentCustomerHistory) {
        const customerHistoryMatchingMonth = currentCustomerHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtMonth === value && createdAtYear === filterYear;
          }
        );
        setQueryedCustomerHistory(customerHistoryMatchingMonth);
      }
    } else {
      if (currentCustomerHistory) {
        const customerHistoryMatchingMonth = currentCustomerHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtMonth = createdAtDate.getMonth() + 1;
            console.log(createdAtMonth);
            return createdAtMonth === value;
          }
        );
        setQueryedCustomerHistory(customerHistoryMatchingMonth);
      }
    }
  };
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const handleViewJob = (item: IJobHistory) => {
    dispatch(setSingleCustomersJob(item));
    router.push(`${pathname}/${item.job._id}`);
  };

  return {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentCustomerHistory,
    handleViewJob,
  };
};
