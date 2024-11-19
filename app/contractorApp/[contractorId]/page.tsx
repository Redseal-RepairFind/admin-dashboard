import ContractorProfileLink from "@/app/_components/ContractorLink";

export default function Page({ params }: { params: { contractorId: string } }) {
  const { contractorId } = params;

  return <ContractorProfileLink contractorsId={contractorId} />;
}
