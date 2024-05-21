import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ITransactionsDetail, ITransactionsDetails } from "@/lib/types";
import { getTransactionDetail } from "@/lib/api/api";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setSingleTranactionsDetail } from "@/lib/redux/slices/single-transaction";
import {
  findTransactionDetailsLargestYear,
  findTransactionDetailsSmallestYear,
} from "@/lib/utils/get-min-or-max-date";
import { generateRange } from "@/lib/utils/generate-range";

interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useTransaction = ({ setLoading }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [totalTransaction, setTotalTransaction] = useState(0);
  const [transactionsDetails, setTransactionsDetails] =
    useState<ITransactionsDetails>();
  const [currentTransactionsDetails, setCurrentTransactionsDetails] =
    useState<ITransactionsDetails>();
  const [queryedTransactionsDetails, setQueryedTransactionsDetails] =
    useState<ITransactionsDetails>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getTransactionDetail({ page: currentPage, limit: 10 }).then((response) => {
      setLoading(false);
      if (response) {
        setTransactionsDetails(response);
        setTotalTransaction(response.totalTansactions);
        console.log(response);
      }
    });
  }, []);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentTransactionsDetails(transactionsDetails);
    } else {
      setCurrentTransactionsDetails(queryedTransactionsDetails);
    }
  }, [isQuerying, transactionsDetails, queryedTransactionsDetails]);

  const dispatch = useAppDispatch();

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);

    if (transactionsDetails) {
      const filterArray = transactionsDetails.transactionDetail.filter((item) =>
        item.from.fullName.toLowerCase().includes(value.toLowerCase())
      );

      setQueryedTransactionsDetails({ transactionDetail: filterArray });

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  useEffect(() => {
    console.log(transactionsDetails);
    if (transactionsDetails) {
      const smallestDate = findTransactionDetailsSmallestYear(
        transactionsDetails.transactionDetail
      );
      const largestDate = findTransactionDetailsLargestYear(
        transactionsDetails.transactionDetail
      );
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentTransactionsDetails]);

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (transactionsDetails) {
        const transactionsDetailsMatchingYear =
          transactionsDetails.transactionDetail.filter((detail) => {
            const createdAtDate = new Date(detail.transaction.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtYear === value && createdAtMonth === filterMonth;
          });
        setQueryedTransactionsDetails({
          transactionDetail: transactionsDetailsMatchingYear,
        });
      }
    } else {
      if (transactionsDetails) {
        const transactionsDetailsMatchingYear =
          transactionsDetails.transactionDetail.filter((detail) => {
            const createdAtDate = new Date(detail.transaction.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            return createdAtYear === value;
          });
        setQueryedTransactionsDetails({
          transactionDetail: transactionsDetailsMatchingYear,
        });
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (transactionsDetails) {
        const transactionsDetailsMatchingMonth =
          transactionsDetails.transactionDetail.filter((detail) => {
            const createdAtDate = new Date(detail.transaction.createdAt);
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtMonth === value && createdAtYear === filterYear;
          });
        setQueryedTransactionsDetails({
          transactionDetail: transactionsDetailsMatchingMonth,
        });
      }
    } else {
      if (transactionsDetails) {
        const transactionsDetailsMatchingMonth =
          transactionsDetails.transactionDetail.filter((detail) => {
            const createdAtDate = new Date(detail.transaction.createdAt);
            const createdAtMonth = createdAtDate.getMonth() + 1;
            console.log(createdAtMonth);
            return createdAtMonth === value;
          });
        setQueryedTransactionsDetails({
          transactionDetail: transactionsDetailsMatchingMonth,
        });
      }
    }
  };

  const handleRatingFiltering = (value: number) => {
    console.log(value);
  };

  const handleViewATransaction = (item: ITransactionsDetail) => {
    setLoading(true);
    dispatch(setSingleTranactionsDetail(item));
    router.push(`${pathname}/${item.transaction._id}`);
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
    currentTransactionsDetails,
    handleViewATransaction,
    currentPage,
    setCurrentPage,
    totalTransaction,
  };
};
