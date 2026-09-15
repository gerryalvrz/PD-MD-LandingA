"use client";

import { useEffect, useState } from "react";

/** Syncs with LandingPage theme toggle via data-landing-theme on <html>. */
export function useLandingThemeDark(defaultDark = true): boolean {
  const [dark, setDark] = useState(defaultDark);

  useEffect(() => {
    const read = () => {
      const value = document.documentElement.dataset.landingTheme;
      if (value === "light") setDark(false);
      else if (value === "dark") setDark(true);
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-landing-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return dark;
}
