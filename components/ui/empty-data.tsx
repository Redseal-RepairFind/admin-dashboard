function Empty({
  message,
  className = "top-8 absolute",
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={` h-[160px]  inset-0 ${className}  flex items-center justify-center`}
    >
      <p className="text-center">{message}</p>
    </div>
  );
}

export default Empty;
