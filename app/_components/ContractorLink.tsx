"use client";

import { useEffect } from "react";

export default function ContractorProfileLink({
  contractorsId,
}: {
  contractorsId: string;
}) {
  useEffect(() => {
    const openProfile = () => {
      const appURL = `repairfindcustomerapp://contractorprofile?contractorsId=${contractorsId}`;
      const appStoreURL = "https://apps.apple.com/app/6483208887";
      const playStoreURL =
        "https://play.google.com/store/apps/details?id=com.theproductdude.repairfindcustomer&pli=1";
      const fallbackURL = `https://repairfind.ca/`;

      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      // Attempt to open the app
      const startTime = Date.now();
      window.location.href = appURL;

      // Redirect to fallback if the app is not opened
      setTimeout(() => {
        if (Date.now() - startTime < 2500) {
          if (isIOS && !isAndroid) {
            window.location.href = appStoreURL;
          } else if (!isIOS && isAndroid) {
            window.location.href = playStoreURL;
          }
        } else {
          // If the app isn't opened within 1500ms, redirect to fallback URL
          window.location.href = fallbackURL;
        }
      }, 2500);
    };

    openProfile(); // Automatically trigger on mount
  }, [contractorsId]);

  return null; // No UI since it auto-triggers
}
