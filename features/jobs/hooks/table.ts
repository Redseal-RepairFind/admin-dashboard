import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getJobs } from "@/lib/api/api";
import { IJobs, IJobsList } from "@/lib/types";
import { generateRange } from "@/lib/utils/generate-range";
import {
  findJobListSmallestYear,
  findJoblistLargestYear,
} from "@/lib/utils/get-min-or-max-date";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setsingleJobDetail } from "@/lib/redux/slices/single-job-detail";
import { RootState } from "@/lib/redux/store";

interface UseJobsTableProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useJobTable = ({ setLoading }: UseJobsTableProps) => {
  const [jobsList, SetJobsList] = useState<IJobsList>();
  const [currentJobsList, setCurrentJobsList] = useState<IJobsList>();
  const [queryedJobsList, setQueryedJobsList] = useState<IJobsList>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    getJobs({ page: currentPage, limit: 10 }).then((response) => {
      SetJobsList(response?.response);
      setLoading(false);
    });
  }, [currentPage]);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentJobsList(jobsList);
    } else {
      setCurrentJobsList(queryedJobsList);
    }
  }, [isQuerying, jobsList, queryedJobsList]);

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);
    if (jobsList) {
      const filterArray = jobsList.jobs.filter(
        (item) =>
          item.customer.fullName.toLowerCase().includes(value.toLowerCase()) ||
          item.contractor.firstName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.contractor.lastName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.job._id.includes(value.toLowerCase())
      );

      setQueryedJobsList({ jobs: filterArray });

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  useEffect(() => {
    if (jobsList) {
      const smallestDate = findJobListSmallestYear(jobsList.jobs);
      const largestDate = findJoblistLargestYear(jobsList.jobs);
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentJobsList]);

  const handleRatingFiltering = (value: number) => {};

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (jobsList) {
        const jobsListMatchingYear = jobsList.jobs.filter((job) => {
          const createdAtDate = new Date(job.job.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = createdAtDate.getMonth() + 1;
          return createdAtYear === value && createdAtMonth === filterMonth;
        });
        setQueryedJobsList({ jobs: jobsListMatchingYear });
      }
    } else {
      if (jobsList) {
        const jobsListMatchingYear = jobsList.jobs.filter((job) => {
          const createdAtDate = new Date(job.job.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          return createdAtYear === value;
        });
        setQueryedJobsList({ jobs: jobsListMatchingYear });
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (jobsList) {
        const jobsListMatchingMonth = jobsList.jobs.filter((job) => {
          const createdAtDate = new Date(job.job.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = createdAtDate.getMonth() + 1;
          return createdAtMonth === value && createdAtYear === filterYear;
        });
        setQueryedJobsList({ jobs: jobsListMatchingMonth });
      }
    } else {
      if (jobsList) {
        const jobsListMatchingMonth = jobsList.jobs.filter((job) => {
          const createdAtDate = new Date(job.job.createdAt);
          const createdAtMonth = createdAtDate.getMonth() + 1;
          // console.log(createdAtMonth);
          return createdAtMonth === value;
        });
        setQueryedJobsList({ jobs: jobsListMatchingMonth });
      }
    }
  };

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const handleViewInvoice = (item: IJobs) => {
    setLoading(true);
    dispatch(setsingleJobDetail(item));
    router.push(`${pathname}/${item.job._id}`);
  };
  const { totalJob } = useAppSelector(
    (state: RootState) => state.overviewTotal.details
  );

  return {
    handleQuery,
    notFound,
    showFilters,
    setShowFilters,
    handleRatingFiltering,
    handleMonthFiltering,
    handleYearFiltering,
    availableYears,
    currentJobsList,
    handleViewInvoice,
    totalJob,
    currentPage,
    setCurrentPage,
  };
};
