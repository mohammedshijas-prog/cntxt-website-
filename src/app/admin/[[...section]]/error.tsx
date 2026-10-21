"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "@/components/admin/admin.module.css";

/** If a portal section fails, say so plainly and offer a way back, instead of a blank page. */
export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("portal:", error.digest ?? error.message);
  }, [error]);
  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <h1>This section didn’t load</h1>
        <p>Something in this part of the portal failed. Your data is safe. Try again, or go back to the first section.</p>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={reset}>
            Try again
          </button>
          <Link className={styles.secondary} href="/admin">
            Back to the portal
          </Link>
        </div>
      </div>
    </div>
  );
}
