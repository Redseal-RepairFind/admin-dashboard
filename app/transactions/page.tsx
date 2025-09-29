export const dynamic = "force-dynamic";

import Layout from "@/features/layout/layout";
import Transactions from "@/features/transactions";

export default function TransactionsPage() {
  return (
    <>
      <Layout>
        <Transactions />
      </Layout>
    </>
  );
}
