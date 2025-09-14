export const dynamic = "force-dynamic";

import Layout from "@/features/layout/layout";
import Jobs from "@/features/jobs";

export default function JobsPage() {
  return (
    <>
      <Layout>
        <Jobs />
      </Layout>
    </>
  );
}
