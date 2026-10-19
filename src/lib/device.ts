/*
 * Device and network hints, read once on the client. Chrome and Android expose
 * them; Safari does not, so there everything falls back to the full experience.
 */
type Hints = {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
};

/** Data Saver is on, or the connection is 2G/3G-class. */
export function slowNetwork() {
  if (typeof navigator === "undefined") return false;
  const connection = (navigator as Navigator & Hints).connection;
  return !!connection && (connection.saveData === true || /(^|-)(2g|3g)$/.test(connection.effectiveType ?? ""));
}

/** A slow network, or a phone with little memory or few cores: draw less. */
export function liteDevice() {
  if (typeof navigator === "undefined") return false;
  const memory = (navigator as Navigator & Hints).deviceMemory;
  return slowNetwork() || (memory !== undefined && memory <= 4) || navigator.hardwareConcurrency <= 4;
}
