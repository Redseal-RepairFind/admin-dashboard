export function sortDescending(numArr: number[]) {
  // Use the sort function with a compare function
  numArr.sort(function (a, b) {
    // Compare b to a for descending order
    return b - a;
  });

  // The array is now sorted in descending order
  return numArr;
}
