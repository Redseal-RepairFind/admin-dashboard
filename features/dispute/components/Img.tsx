import Image from "next/image";

const MyComponent = ({
  url,
  placeholderUrl,
}: {
  url: any;
  placeholderUrl?: string;
}) => {
  // Check if the profile photo URL is defined and valid
  const placeholder = placeholderUrl || "/user.png";

  const imageUrl = url || placeholder;

  return <Image src={imageUrl} width={50} height={50} alt="contractor image" />;
};

export default MyComponent;
