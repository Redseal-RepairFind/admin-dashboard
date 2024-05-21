export function trimString(string: string, maxLength: number): string {
  if (string.length > maxLength) {
    const trimmed = string.substring(0, maxLength) + "...";
    return trimmed;
  }
  return string;
}
