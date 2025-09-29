export const dynamic = "force-dynamic";

import Index from "@/features/appVersion/Index";
import Header from "@/features/layout/header/header";
import Layout from "@/features/layout/layout";
import PageBody from "@/features/shared/page-body/page-body";
import PageHeading from "@/features/shared/page-body/page-heading";

function page() {
  return (
    <Layout>
      <Index />
    </Layout>
  );
}

export default page;
