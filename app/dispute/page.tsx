export const dynamic = "force-dynamic";

import React from "react";
import Layout from "@/features/layout/layout";
import Dispute from "@/features/dispute";

function page() {
  return (
    <Layout>
      <Dispute />
    </Layout>
  );
}

export default page;
