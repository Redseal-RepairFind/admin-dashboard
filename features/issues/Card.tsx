import Image from "next/image";

function Card({
  initiator,
  customer,
  title,
  sanctions,
  onClick,
  data,
  type = "issue",
}: {
  initiator?: any;
  customer?: any;
  title: string;
  sanctions?: any;
  onClick?: any;
  data?: any;
  type?: string;
}) {
  // console.log(data);
  return (
    <div
      className="p-3 rounded-md bg-white grid grid-cols-[100px,1fr] min-w-[500px] cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full">
        <div className="relative h-16 w-16 rounded-full">
          <Image
            src={data?.profilePhoto?.url}
            fill
            alt="User Image"
            className="rounded-full"
          />
        </div>
      </div>
      <div>
        <span className="flex items-center gap-1.5 mb-3">
          <h2 className="text-sm font-semibold text-[#757575]">
            {title?.includes("customer") ? "Customer" : "Contractor"}
          </h2>

          {(title?.includes("contractor") && initiator) ||
          (title?.includes("customer") && initiator) ? (
            <>
              <Tag tag="reporter" name="Initiator" />
              <Tag tag="" name={`${data?.sanctions?.length} of 3`} />
            </>
          ) : (title?.includes("contractor") && !initiator) ||
            (title?.includes("customer") && !initiator) ? (
            <Tag tag="" name={`${data?.sanctions?.length} of 3`} />
          ) : null}
        </span>

        <h1 className="text-[20px] font-bold mb-3">
          {`${data?.firstName} ${data?.lastName}`}
        </h1>
        <p className="text-[#757575] text-sm mb-3">
          Phone Number:{" "}
          {`${data?.phoneNumber?.code} ${data?.phoneNumber?.number}`}
        </p>
        <p className="text-[#757575] text-sm">Email: {data?.email}</p>
      </div>
    </div>
  );
}

export function Tag({ tag, name }: { tag: any; name: string }) {
  return (
    <span
      className={`${
        tag.toLowerCase() === "reporter"
          ? "bg-[#f0f0f0] text-[#363636] rounded-md h-5 flex items-center justify-center"
          : "bg-[#ffd6d6] text-[#dc2525] rounded-[28px]"
      } px-2 text-[12px]`}
    >
      {name}
    </span>
  );
}

export default Card;
