export const dynamic = "force-dynamic";

import Layout from "@/features/layout/layout";
import JobDays from "@/features/jobDays/index";

export default function JobsPage() {
  return (
    <>
      <Layout>
        <JobDays />
      </Layout>
    </>
  );
}
