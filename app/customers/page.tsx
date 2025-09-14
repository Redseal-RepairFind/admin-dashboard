export const dynamic = "force-dynamic";

import Customers from "@/features/customers";
import Layout from "@/features/layout/layout";

export default function CustomersPage() {
  return (
    <>
      <Layout>
        <Customers type="norm" />
      </Layout>
    </>
  );
}
