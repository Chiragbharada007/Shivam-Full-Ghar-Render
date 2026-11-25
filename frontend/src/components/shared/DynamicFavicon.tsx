"use client";

import { useEffect } from "react";

export function DynamicFavicon() {
  useEffect(() => {
    const updateFavicon = (url?: string) => {
      try {
        let logoUrl = url;
        if (!logoUrl) {
          const cached = localStorage.getItem("shivam_site_settings");
          if (cached) {
            const parsed = JSON.parse(cached);
            logoUrl = parsed.logoUrl;
          }
        }

        if (logoUrl) {
          // Update all rel="icon" links
          const iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
          if (iconLinks.length > 0) {
            iconLinks.forEach((link) => {
              link.href = logoUrl!;
            });
          } else {
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = logoUrl;
            document.head.appendChild(link);
          }

          // Update apple-touch-icon
          const appleLinks = document.querySelectorAll<HTMLLinkElement>("link[rel='apple-touch-icon']");
          if (appleLinks.length > 0) {
            appleLinks.forEach((link) => {
              link.href = logoUrl!;
            });
          } else {
            const link = document.createElement("link");
            link.rel = "apple-touch-icon";
            link.href = logoUrl;
            document.head.appendChild(link);
          }
        }
      } catch (e) {}
    };

    updateFavicon();

    const handleUpdated = () => updateFavicon();
    window.addEventListener("site-settings-updated", handleUpdated);
    return () => window.removeEventListener("site-settings-updated", handleUpdated);
  }, []);

  return null;
}
