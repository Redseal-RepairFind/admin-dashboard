"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { IJobs, IJobsList } from "@/lib/types";
import { generateRange } from "@/lib/utils/generate-range";
import {
  findJobListSmallestYear,
  findJoblistLargestYear,
} from "@/lib/utils/get-min-or-max-date";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setsingleJobDetail } from "@/lib/redux/slices/single-job-detail";
import { RootState } from "@/lib/redux/store";
import { useSortedData } from "@/lib/hooks/useSortedData";
import { customers } from "@/lib/api/customers";
import { useQuery } from "react-query";

interface UseJobsTableProps {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useJobTable = ({ setLoading }: UseJobsTableProps) => {
  const { slug } = useParams();

  const [currentJobsList, setCurrentJobsList] = useState<any>([]);
  const [queryedJobsList, setQueryedJobsList] = useState<any>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  // Using the useAnalyticData hook
  const { sortedData: jobData, loadingSortedData: loadingCustomers } =
    useSortedData("jobs");

  useEffect(() => {
    setLoading?.(loadingCustomers);
    if (jobData?.data?.data) {
      setCurrentJobsList(jobData?.data?.data);
    }
  }, [jobData, loadingCustomers]);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentJobsList(jobData?.data?.data || undefined);
    } else {
      setCurrentJobsList(queryedJobsList);
    }
  }, [isQuerying, jobData, queryedJobsList]);

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);
    if (jobData?.data?.data) {
      const filterArray = jobData?.data?.data?.filter(
        (item: any) =>
          item?.customer?.name?.toLowerCase()?.includes(value.toLowerCase()) ||
          item?.contractor?.firstName
            ?.toLowerCase()
            ?.includes(value.toLowerCase()) ||
          item?.contractor?.lastName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item?._id?.includes(value.toLowerCase())
      );

      setQueryedJobsList([...filterArray]);

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  useEffect(() => {
    if (jobData?.data?.data) {
      const smallestDate = findJobListSmallestYear(jobData.data?.data);
      const largestDate = findJoblistLargestYear(jobData.data?.data);
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentJobsList, jobData]);

  const handleRatingFiltering = (value: number) => {};

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (jobData?.data?.data) {
        const jobsListMatchingYear = jobData?.data?.data.filter((job: any) => {
          const createdAtDate = new Date(job.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = createdAtDate.getMonth() + 1;
          return createdAtYear === value && createdAtMonth === filterMonth;
        });
        setQueryedJobsList([...jobsListMatchingYear]);
      }
    } else {
      if (jobData?.data?.data) {
        const jobsListMatchingYear = jobData.response.jobs.filter(
          (job: any) => {
            const createdAtDate = new Date(job.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            return createdAtYear === value;
          }
        );
        setQueryedJobsList([...jobsListMatchingYear]);
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (jobData?.data?.data) {
        const jobsListMatchingMonth = jobData.data.data.filter((job: any) => {
          const createdAtDate = new Date(job.createdAt);
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtMonth = createdAtDate.getMonth() + 1;
          return createdAtMonth === value && createdAtYear === filterYear;
        });
        setQueryedJobsList([...jobsListMatchingMonth]);
      }
    } else {
      if (jobData?.data?.data) {
        const jobsListMatchingMonth = jobData.data.data.filter((job: any) => {
          const createdAtDate = new Date(job.createdAt);
          const createdAtMonth = createdAtDate.getMonth() + 1;
          return createdAtMonth === value;
        });
        setQueryedJobsList([...jobsListMatchingMonth]);
      }
    }
  };

  const { isLoading: loadingSingleJob, data: aingleJob } = useQuery(
    ["single job"],
    () => customers.getSingleJob(slug.toString())
  );

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const handleViewInvoice = (item: any) => {
    setLoading?.(true);
    dispatch(setsingleJobDetail(item));
    router.push(`${pathname}/${item._id}`);
  };
  const { totalJob } = useAppSelector(
    (state: RootState) => state.overviewTotal.details
  );

  const totalJobs = jobData?.data?.stats?.allJobs;

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
    totalJobs,
    loadingSingleJob,
    aingleJob,
  };
};
