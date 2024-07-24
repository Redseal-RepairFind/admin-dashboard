import Image from "next/image";

const MyComponent = ({ url }: { url: any }) => {
  // Check if the profile photo URL is defined and valid
  const imageUrl = url || "/user.png";

  return <Image src={imageUrl} width={50} height={50} alt="contractor image" />;
};

export default MyComponent;
