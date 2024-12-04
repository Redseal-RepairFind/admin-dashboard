import SingleIssue from "@/features/issues/Single-Issue";
import Header from "@/features/layout/header/header";
import Layout from "@/features/layout/layout";
import { customers } from "@/lib/api/customers";

function page({ params }: { params: any }) {
  return (
    <Layout>
      <SingleIssue id={params?.id} />
    </Layout>
  );
}

export default page;
