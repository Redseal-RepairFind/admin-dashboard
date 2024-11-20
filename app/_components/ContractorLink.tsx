"use client";

import { useEffect, useState } from "react";

export default function ContractorProfileLink({
  contractorsId,
}: {
  contractorsId: string;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setErrorMessage(
          "Your browser does not support deep linking. Please visit the App Store or Play Store."
        );
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
      try {
        globalObject.location.href = appURL;
      } catch (error) {
        console.error("Error attempting to open the app:", error);
        setErrorMessage("Failed to open the app. Please try again.");
        return;
      }

      // Redirect after timeout if the app isn't opened
      const timeout = setTimeout(() => {
        if (Date.now() - startTime < 1500) {
          if (isIOS) {
            globalObject.location.href = appStoreURL;
          } else if (isAndroid) {
            globalObject.location.href = playStoreURL;
          } else {
            globalObject.location.href = fallbackURL; // Desktop fallback
          }
        }
      }, 1500);

      // Cleanup timeout
      return () => clearTimeout(timeout);
    };

    openProfile(); // Automatically trigger on mount
  }, [contractorsId]);

  return (
    <>
      {errorMessage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-red-600 font-bold mb-4">{errorMessage}</p>
            <a
              href="https://repairfind.ca/"
              className="text-blue-500 underline"
            >
              Open Website
            </a>
          </div>
        </div>
      )}
    </>
  );
}
