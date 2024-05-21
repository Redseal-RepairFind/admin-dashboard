import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getContactorDetail } from "@/lib/api/api";
import { IContractors, IContractorsDetails } from "@/lib/types";
import { setsingleContractorsDetail } from "../../../lib/redux/slices/single-contractor";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  findContractorsLargestYear,
  findContractorsSmallestYear,
} from "@/lib/utils/get-min-or-max-date";
import { generateRange } from "@/lib/utils/generate-range";
interface IProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useContractorTable = ({ setLoading }: IProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [contractors, setContractors] = useState<IContractors>();
  const [currentContractors, setCurrentContractors] = useState<IContractors>();
  const [queryedContractors, setQueryedContractors] = useState<IContractors>();
  const [isQuerying, setIsQuerying] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const data = {
      page: 1,
      limit: 1,
    };

    getContactorDetail(data).then((response: IContractors) => {
      setLoading(false);
      setContractors(response);
      console.log(response);
    });
  }, []);

  useEffect(() => {
    if (!isQuerying) {
      setCurrentContractors(contractors);
    } else {
      setCurrentContractors(queryedContractors);
    }
  }, [isQuerying, contractors, queryedContractors]);

  const dispatch = useAppDispatch();

  const handleViewAContractors = (item: IContractorsDetails) => {
    setLoading(true);
    dispatch(setsingleContractorsDetail(item));
    router.push(`${pathname}/${item.contractorProfile._id}`);
  };

  const handleQuery = (value: string) => {
    value === "" ? setIsQuerying(false) : setIsQuerying(true);

    if (contractors) {
      const filterArray = contractors.artisans.filter(
        (item) =>
          item.contractorProfile.email
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.contractorProfile.firstName
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.contractorProfile.lastName
            .toLowerCase()
            .includes(value.toLowerCase())
      );

      setQueryedContractors({ artisans: filterArray });

      filterArray.length === 0 ? setNotFound(true) : setNotFound(false);
    }
  };

  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([0]);

  useEffect(() => {
    if (contractors) {
      const smallestDate = findContractorsSmallestYear(contractors.artisans);
      const largestDate = findContractorsLargestYear(contractors.artisans);
      setAvailableYears(generateRange(smallestDate, largestDate));
    }
  }, [currentContractors]);

  const [filterYear, setFilterYear] = useState(0);
  const [filterMonth, setFilterMonth] = useState(0);

  const handleYearFiltering = (value: number) => {
    setFilterYear(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterMonth !== 0) {
      if (contractors) {
        const contractorsMatchingYear = contractors.artisans.filter(
          (artisans) => {
            const createdAtDate = new Date(
              artisans.contractorProfile.createdAt
            );
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtYear === value && createdAtMonth === filterMonth;
          }
        );
        setQueryedContractors({ artisans: contractorsMatchingYear });
      }
    } else {
      if (contractors) {
        const contractorsMatchingYear = contractors.artisans.filter(
          (artisans) => {
            const createdAtDate = new Date(
              artisans.contractorProfile.createdAt
            );
            const createdAtYear = createdAtDate.getFullYear();
            return createdAtYear === value;
          }
        );
        setQueryedContractors({ artisans: contractorsMatchingYear });
      }
    }
  };

  const handleMonthFiltering = (value: number) => {
    setFilterMonth(value);
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (filterYear !== 0) {
      if (contractors) {
        const contractorsMatchingMonth = contractors.artisans.filter(
          (artisans) => {
            const createdAtDate = new Date(
              artisans.contractorProfile.createdAt
            );
            const createdAtYear = createdAtDate.getFullYear();
            const createdAtMonth = createdAtDate.getMonth() + 1;
            return createdAtMonth === value && createdAtYear === filterYear;
          }
        );
        setQueryedContractors({ artisans: contractorsMatchingMonth });
      }
    } else {
      if (contractors) {
        const ContractorsMatchingMonth = contractors.artisans.filter(
          (artisans) => {
            const createdAtDate = new Date(
              artisans.contractorProfile.createdAt
            );
            const createdAtMonth = createdAtDate.getMonth() + 1;
            console.log(createdAtMonth);
            return createdAtMonth === value;
          }
        );
        setQueryedContractors({ artisans: ContractorsMatchingMonth });
      }
    }
  };

  const handleRatingFiltering = (value: number) => {
    value === 0 ? setIsQuerying(false) : setIsQuerying(true);
    if (contractors) {
      const filteredMatchingRating = contractors.artisans.filter(
        (item) => item.rating?.avgRating === value
      );

      console.log(filteredMatchingRating);

      setQueryedContractors({ artisans: filteredMatchingRating });
    }
  };

  const handleStatusFiltering = (value: number) => {
    console.log(value);
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
    currentContractors,
    handleViewAContractors,
  };
};
