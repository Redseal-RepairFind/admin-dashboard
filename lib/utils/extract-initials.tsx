export function extractInitials(fullName: string | undefined) {
  // Split the full name into individual words
  if(fullName === undefined){
    return
  }
  console.log(fullName);
  const words = fullName.split(" ");

  // Extract the first character of each word
  const initials = words
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join("");

  return initials.toUpperCase();
}

export function extractFirstLetter(name: string) {
  const firstLetter = name.slice(0, 1);
  return firstLetter.toUpperCase();
}
