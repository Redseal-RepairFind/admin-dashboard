export function generateRange(start: number | null, end: number | null) {
  if (start === null || end === null) {
    return [];
  }
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
