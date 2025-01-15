import { customers } from "@/lib/api/customers";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export function useJobInfo(id: any) {
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryedList, setQueryedList] = useState<any>();
  const [filterData, setFilterData] = useState<any>();
  const { isLoading, data: jobInfo } = useQuery(
    ["Job Information", id],
    () => {
      return customers.getCustomerHistory({
        id,
      });
    },
    {
      refetchOnWindowFocus: true,
      select: (response) => response,
    }
  );

  useEffect(() => {
    setFilterData(jobInfo);
  }, [jobInfo]);

  function handleQuery(query: any) {
    if (query) {
      setIsQuerying(true);
      const filteredData = jobInfo?.jobs?.filter(
        (data: any) =>
          data?.contractor?.name?.toLowerCase().includes(query.toLowerCase()) ||
          data?.title?.toLowerCase().includes(query.toLowerCase())
      );

      const updatedFilteredData = {
        ...jobInfo,
        jobs: filteredData,
      };
      setQueryedList(updatedFilteredData);
    } else {
      setIsQuerying(false);
    }
  }

  function handleFilter(type: "status" | "types", value: string) {
    let filteredData;
    if (type === "status") {
      if (value === "") setFilterData(jobInfo);
      filteredData = jobInfo?.jobs?.filter((data: any) =>
        data?.status?.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      if (value === "") setFilterData(jobInfo);

      filteredData = jobInfo?.jobs?.filter((data: any) =>
        data?.type?.toLowerCase().includes(value.toLowerCase())
      );
    }

    const updatedFilteredData = {
      ...jobInfo,
      jobs: filteredData,
    };

    setFilterData(updatedFilteredData);
  }

  return {
    isLoading,
    jobInfo,
    isQuerying,
    queryedList,
    handleQuery,
    setFilterData,
    filterData,
    handleFilter,
  };
}
