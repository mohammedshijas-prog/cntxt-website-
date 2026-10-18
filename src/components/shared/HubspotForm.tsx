"use client";

import { useEffect, useId } from "react";

const PORTAL_ID = "48027770";
const REGION = "na1";

type HubspotWindow = Window & {
  hbspt?: { forms: { create: (options: Record<string, unknown>) => void } };
};

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.charset = "utf-8";
    script.addEventListener("load", () => {
      script.dataset.loaded = "1";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), { once: true });
    document.body.appendChild(script);
  });
}

/**
 * A HubSpot form, embedded the same way as on the current cntxt.tech so Google
 * Tag Manager's HubSpot listeners (and the Google Ads conversion) keep firing.
 *
 * - "v2": the classic embed (hbspt.forms.create), used by the Contact us form.
 * - "frame": the newer iframe embed, used by the Partnership form.
 */
export function HubspotForm({ formId, embed }: { formId: string; embed: "v2" | "frame" }) {
  const id = `hs-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    let cancelled = false;
    if (embed === "v2") {
      loadScript("https://js.hsforms.net/forms/embed/v2.js")
        .then(() => {
          const target = document.getElementById(id);
          const hbspt = (window as HubspotWindow).hbspt;
          if (cancelled || !target || !hbspt || target.childElementCount) return;
          hbspt.forms.create({ portalId: PORTAL_ID, formId, region: REGION, target: `#${id}` });
        })
        .catch(() => undefined);
    } else {
      // The frame embed scans the page for .hs-form-frame elements when its script runs.
      loadScript(`https://js.hsforms.net/forms/embed/${PORTAL_ID}.js`).catch(() => undefined);
    }
    return () => {
      cancelled = true;
    };
  }, [embed, formId, id]);

  if (embed === "frame") {
    return <div className="hs-form-frame" data-region={REGION} data-form-id={formId} data-portal-id={PORTAL_ID} />;
  }
  return <div id={id} />;
}
