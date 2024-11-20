import ContractorProfileLink from "@/app/_components/ContractorLink";

export default function Page({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  const { id } = searchParams;

  // If `id` is missing, show an error or fallback
  if (!id) {
    return <div>No contractor ID provided. Please check the link.</div>;
  }

  return <ContractorProfileLink contractorsId={id} />;
}
