import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        display: "grid",
        minHeight: "100vh",
        placeItems: "center",
        padding: 24,
        background: "#fafaf8",
        color: "#0f0c0b",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ color: "#7d52f4", fontFamily: "var(--font-heading)", letterSpacing: "0.08em" }}>404</p>
        <h1 style={{ margin: "12px 0", fontSize: "var(--fs-display)", fontWeight: 400, lineHeight: "var(--lh-display)" }}>
          This page does not exist.
        </h1>
        <p style={{ color: "rgba(15, 12, 11, 0.62)", fontSize: "var(--fs-lead)", lineHeight: "var(--lh-lead)" }}>
          The link may be old, or the page may have moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: 48,
            marginTop: 28,
            padding: "0 20px",
            borderRadius: 10,
            background: "#7d52f4",
            color: "#ffffff",
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
          }}
        >
          Back to the home page
        </Link>
      </div>
    </main>
  );
}
