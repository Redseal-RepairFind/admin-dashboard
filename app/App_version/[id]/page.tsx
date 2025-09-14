export const dynamic = "force-dynamic";

import SingleVersion from "@/features/appVersion/single-version";

function page({ params }: { params: any }) {
  return <SingleVersion />;
}

export default page;
