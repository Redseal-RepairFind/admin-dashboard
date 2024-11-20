"use client";

import { useEffect, useState } from "react";

export default function ContractorProfileLink({
  contractorsId,
}: {
  contractorsId: string;
}) {
  useEffect(() => {
    const openProfile = () => {
      // Detect global object
      const globalObject =
        typeof window !== "undefined"
          ? window
          : typeof self !== "undefined"
          ? self
          : typeof global !== "undefined"
          ? global
          : null;

      if (!globalObject || !globalObject.location) {
        // Fallback if no global object with location
        console.error("No global object with location support.");

        return;
      }

      // Define URLs
      const appURL = `repairfindcustomerapp://contractorprofile?contractorsId=${contractorsId}`;
      const appStoreURL = "https://apps.apple.com/app/6483208887";
      const playStoreURL =
        "https://play.google.com/store/apps/details?id=com.theproductdude.repairfindcustomer&pli=1";
      const fallbackURL = `https://repairfind.ca/`;

      // Detect platform
      const userAgent = globalObject.navigator?.userAgent || "";
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
      const isAndroid = /Android/i.test(userAgent);

      // Attempt to open the app
      const startTime = Date.now();
      window.location.href = appURL;

      // Redirect to fallback if the app is not opened
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

    openProfile(); // Automatically trigger on mount
  }, [contractorsId]);
  return null;
}
