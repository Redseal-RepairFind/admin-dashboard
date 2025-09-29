type FilterData = {
  customers: any[];
  totalCustomer: any;
};

export function filterData(data: FilterData, query: string | null) {
  const queryString = query?.replaceAll("_", " ");
  const curDate = new Date();

  // Default to returning all data if there's no query string or it doesn't match any case
  let queryData = data?.customers;

  if (queryString?.toLowerCase() === "last 24h") {
    queryData = data?.customers?.filter(
      (item) =>
        new Date(item?.createdAt) >=
        new Date(curDate.getTime() - 24 * 60 * 60 * 1000)
    ); // Last 24 hours
  } else if (queryString?.toLowerCase() === "last 7 days") {
    queryData = data?.customers?.filter(
      (item) =>
        new Date(item?.createdAt) >=
        new Date(curDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    ); // Last 7 days
  } else if (queryString?.toLowerCase() === "last 30 days") {
    queryData = data?.customers?.filter(
      (item) =>
        new Date(item?.createdAt) >=
        new Date(curDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    ); // Last 30 days
  }

  return { ...data, customers: queryData };
}
