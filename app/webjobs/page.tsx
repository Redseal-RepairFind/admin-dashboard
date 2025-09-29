export const dynamic = "force-dynamic";

import WebJobs from "@/features/jobs/webjobs-index";
import Layout from "@/features/layout/layout";

export default function JobsPage() {
  return (
    <>
      <Layout>
        <WebJobs />
      </Layout>
    </>
  );
}
