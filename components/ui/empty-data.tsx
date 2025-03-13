function Empty({ message }: { message: string }) {
  return (
    <div className=" h-[160px] absolute inset-0  top-8 flex items-center justify-center">
      <p className="text-center">{message}</p>
    </div>
  );
}

export default Empty;
