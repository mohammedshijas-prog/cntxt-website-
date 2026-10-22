/** Helpers shared by the portal's sections. */

export const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Download rows as a CSV file named cntxt-<name>-<date>.csv. */
export function downloadCsv(name: string, header: string[], rows: (string | number | null | undefined)[][]) {
  // A leading = + - @ would run as a formula in Excel (CSV injection); prefix it so it stays text.
  const cell = (value: string | number | null | undefined) => {
    const text = String(value ?? "");
    const safe = typeof value === "string" && /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const blob = new Blob([[header.map(cell).join(","), ...rows.map((row) => row.map(cell).join(","))].join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `cntxt-${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}
