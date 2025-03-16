export const dynamic = "force-dynamic";

import Staff from "@/features/staff";
import Layout from "@/features/layout/layout";

export default function Page() {
  return (
    <>
      <Layout>
        <Staff />
      </Layout>
    </>
  );
}
