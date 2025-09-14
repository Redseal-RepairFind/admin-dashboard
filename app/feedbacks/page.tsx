export const dynamic = "force-dynamic";

import Feedbacks from "@/components/feedbacks";
import Layout from "@/features/layout/layout";

function page() {
  return (
    <Layout>
      <Feedbacks />
    </Layout>
  );
}

export default page;
