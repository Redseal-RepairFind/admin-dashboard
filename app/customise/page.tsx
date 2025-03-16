export const dynamic = "force-dynamic";
import Customise from "@/features/customise";
import Layout from "@/features/layout/layout";

export default function CustomizePage() {
  return (
    <>
      <Layout>
        <Customise />
      </Layout>
    </>
  );
}
