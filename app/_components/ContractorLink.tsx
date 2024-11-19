"use client";

import { useEffect } from "react";

export default function ContractorProfileLink({
  contractorsId,
}: {
  contractorsId: string;
}) {
  useEffect(() => {
    const openProfile = () => {
      // App deep link URL
      const appURL = `repairfindcustomerapp://contractorprofile?contractorsId=${contractorsId}`;

      // Store URLs for fallback
      const appStoreURL = "https://apps.apple.com/app/repairfind-customer-app";
      const playStoreURL =
        "https://play.google.com/store/apps/details?id=com.repairfindcustomer";
      const fallbackURL = `https://repairfind.ca/contractorprofile/${contractorsId}`;

      // Detect user platform
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      // Attempt to open the app
      const startTime = Date.now();
      window.location.href = appURL;

      // Redirect to fallback after a timeout if the app does not open
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

    // Trigger the function on component mount
    openProfile();
  }, [contractorsId]);

  return null; // No UI needed since it's auto-triggered
}
