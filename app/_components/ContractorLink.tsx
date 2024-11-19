"use client";

import { useEffect } from "react";

export default function ContractorProfileLink({
  contractorsId,
}: {
  contractorsId: string;
}) {
  useEffect(() => {
    const openProfile = () => {
      // Dynamic URLs
      const appURL = `repairfindcustomerapp://contractorprofile?contractorsId=${contractorsId}`;
      const appStoreURL = "https://apps.apple.com/app/repairfind-customer-app";
      const playStoreURL =
        "https://play.google.com/store/apps/details?id=com.repairfindcustomer";
      const fallbackURL = `https://repairfind.ca/contractorprofile/${contractorsId}`;

      // Detect platform
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      // Try opening the app
      const startTime = Date.now();
      window.location.href = appURL;

      // Redirect to the appropriate store or fallback after a timeout
      setTimeout(() => {
        if (Date.now() - startTime < 1500) {
          if (isIOS) {
            window.location.href = appStoreURL;
          } else if (isAndroid) {
            window.location.href = playStoreURL;
          } else {
            window.location.href = fallbackURL; // Desktop fallback
          }
        }
      }, 1500);
    };

    // Attach the event listener
    const button = document.getElementById("openContractorProfile");
    button?.addEventListener("click", openProfile);

    return () => {
      // Cleanup
      button?.removeEventListener("click", openProfile);
    };
  }, [contractorsId]);

  return (
    <button
      id="openContractorProfile"
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Open Contractor Profile
    </button>
  );
}
