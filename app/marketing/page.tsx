export const dynamic = "force-dynamic";

import Staff from "@/features/staff";
import Layout from "@/features/layout/layout";
import PushNotification from "@/features/marketing";

export default function Page() {
  return (
    <>
      <Layout>
        <PushNotification />
      </Layout>
    </>
  );
}
