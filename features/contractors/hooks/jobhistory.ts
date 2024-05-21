import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IJobHistory } from "@/lib/types";
import { generateRange } from "@/lib/utils/generate-range";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setSingleContractorsJob } from "@/lib/redux/slices/single-contractor";

interface IProps {
  jobHistory: IJobHistory[];
}

function findContractorHistorySmallestYear(arrayOfObjects: IJobHistory[]) {
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

function findContractorHistoryLargestYear(arrayOfObjects: IJobHistory[]) {
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

export const useContractorHistoryTable = ({ jobHistory }: IProps) => {
  const [currentContractorHistory, setCurrentContractorHistory] =
    useState<IJobHistory[]>();
  const [queryedContractorHistory, setQueryedContractorHistory] =
    useState<IJobHistory[]>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentContractorHistory(jobHistory);
      console.log("not querying");
    } else {
      setCurrentContractorHistory(queryedContractorHistory);
      console.log("querying");
    }
  }, [isQuerying, jobHistory, queryedContractorHistory]);

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);
    if (jobHistory) {
      const filterArray = jobHistory.filter(
        (item) =>
          item?.customer?.fullName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.job._id.includes(value.toLowerCase())
      );

      setQueryedContractorHistory(filterArray);

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  useEffect(() => {
    if (jobHistory) {
      const smallestDate = findContractorHistorySmallestYear(jobHistory);
      const largestDate = findContractorHistoryLargestYear(jobHistory);
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentContractorHistory]);

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (currentContractorHistory) {
        const ContractorHistoryMatchingYear = currentContractorHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtYear === value && createdAtMonth === filterMonth;
          }
        );
        setQueryedContractorHistory(ContractorHistoryMatchingYear);
      }
    } else {
      if (currentContractorHistory) {
        const ContractorHistoryMatchingYear = currentContractorHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            return createdAtYear === value;
          }
        );
        setQueryedContractorHistory(ContractorHistoryMatchingYear);
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (currentContractorHistory) {
        const ContractorHistoryMatchingMonth = currentContractorHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtMonth === value && createdAtYear === filterYear;
          }
        );
        setQueryedContractorHistory(ContractorHistoryMatchingMonth);
      }
    } else {
      if (currentContractorHistory) {
        const ContractorHistoryMatchingMonth = currentContractorHistory.filter(
          (history) => {
            const createdAtDate = new Date(history.job.createdAt);
            const createdAtMonth = createdAtDate.getMonth() + 1;
            console.log(createdAtMonth);
            return createdAtMonth === value;
          }
        );
        setQueryedContractorHistory(ContractorHistoryMatchingMonth);
      }
    }
  };
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const handleViewJob = (item: IJobHistory) => {
    dispatch(setSingleContractorsJob(item));
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
    currentContractorHistory,
    handleViewJob,
  };
};
