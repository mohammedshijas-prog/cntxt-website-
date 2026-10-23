"use client";

import { useEffect } from "react";

/*
 * Marketing tags (Google Tag Manager, which brings Google Ads, Analytics,
 * LinkedIn and the Meta pixel, plus HubSpot) add about 1.4 MB of script.
 * They load on the visitor's first interaction, or a few seconds after the
 * page has loaded, so they never slow down the page becoming usable.
 */
export function DeferredTags({ gtmId, hubspotId }: { gtmId: string; hubspotId: string }) {
  useEffect(() => {
    let done = false;
    const events = ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"] as const;
    let timer = 0;

    const add = (src: string, id: string) => {
      if (document.getElementById(id)) return;
      const script = document.createElement("script");
      script.id = id;
      script.async = true;
      script.src = src;
      document.head.appendChild(script);
    };

    const load = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, load));
      const w = window as unknown as { dataLayer?: unknown[] };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      add(`https://www.googletagmanager.com/gtm.js?id=${gtmId}`, "gtm-script");
      add(`https://js.hs-scripts.com/${hubspotId}.js`, "hs-script-loader");
    };

    events.forEach((name) => window.addEventListener(name, load, { once: true, passive: true }));
    const arm = () => {
      timer = window.setTimeout(load, 4000);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", arm);
      events.forEach((name) => window.removeEventListener(name, load));
    };
  }, [gtmId, hubspotId]);
  return null;
}
