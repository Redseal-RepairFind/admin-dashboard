import {
  IContractorsDetails,
  ICustomerData,
  IJobs,
  IJobsList,
  ISubAdmin,
  ITransactionsDetail,
  ITransactionsDetails,
} from "../types";

export function findSmallestYear(arrayOfObjects: ISubAdmin[]) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let smallestDate = new Date(arrayOfObjects[0].createdAt);
  let smallestYear = smallestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].createdAt);
    if (currentDate < smallestDate) {
      smallestDate = currentDate;
      smallestYear = currentDate.getFullYear();
    }
  }

  return smallestYear;
}

export function findLargestYear(arrayOfObjects: ISubAdmin[]) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let largestDate = new Date(arrayOfObjects[0].createdAt);
  let largestYear = largestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].createdAt);
    if (currentDate > largestDate) {
      largestDate = currentDate;
      largestYear = currentDate.getFullYear();
    }
  }

  return largestYear;
}

export function findContractorsSmallestYear(
  arrayOfObjects: IContractorsDetails[]
) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let smallestDate = new Date(arrayOfObjects[0].contractorProfile.createdAt);
  let smallestYear = smallestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].contractorProfile.createdAt);
    if (currentDate < smallestDate) {
      smallestDate = currentDate;
      smallestYear = currentDate.getFullYear();
    }
  }

  return smallestYear;
}

export function findContractorsLargestYear(
  arrayOfObjects: IContractorsDetails[]
) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let largestDate = new Date(arrayOfObjects[0].contractorProfile.createdAt);
  let largestYear = largestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].contractorProfile.createdAt);
    if (currentDate > largestDate) {
      largestDate = currentDate;
      largestYear = currentDate.getFullYear();
    }
  }

  return largestYear;
}

export function findTransactionDetailsSmallestYear(
  arrayOfObjects: ITransactionsDetail[]
) {
  console.log(arrayOfObjects);
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let smallestDate = new Date(arrayOfObjects[0].transaction.createdAt);
  let smallestYear = smallestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].transaction.createdAt);
    if (currentDate < smallestDate) {
      smallestDate = currentDate;
      smallestYear = currentDate.getFullYear();
    }
  }

  return smallestYear;
}

export function findTransactionDetailsLargestYear(
  arrayOfObjects: ITransactionsDetail[]
) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let largestDate = new Date(arrayOfObjects[0].transaction.createdAt);
  let largestYear = largestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].transaction.createdAt);
    if (currentDate > largestDate) {
      largestDate = currentDate;
      largestYear = currentDate.getFullYear();
    }
  }

  return largestYear;
}

export function findCustomersSmallestYear(arrayOfObjects: ICustomerData[]) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let smallestDate = new Date(arrayOfObjects[0].customer.createdAt);
  let smallestYear = smallestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].customer.createdAt);
    if (currentDate < smallestDate) {
      smallestDate = currentDate;
      smallestYear = currentDate.getFullYear();
    }
  }

  return smallestYear;
}

export function findCustomersLargestYear(arrayOfObjects: ICustomerData[]) {
  if (arrayOfObjects.length === 0) {
    return null; // Return null if the array is empty
  }

  let largestDate = new Date(arrayOfObjects[0].customer.createdAt);
  let largestYear = largestDate.getFullYear();

  for (let i = 1; i < arrayOfObjects.length; i++) {
    const currentDate = new Date(arrayOfObjects[i].customer.createdAt);
    if (currentDate > largestDate) {
      largestDate = currentDate;
      largestYear = currentDate.getFullYear();
    }
  }

  return largestYear;
}

export function findJobListSmallestYear(arrayOfObjects: IJobs[]) {
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

export function findJoblistLargestYear(arrayOfObjects: IJobs[]) {
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
