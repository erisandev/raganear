/**
 * Formats nanosecond expiration timestamp into a readable countdown string:
 * e.g. "01h 45m 22s" or "TIME-LOCK EXPIRED".
 */
export function formatTimeRemaining(expiresAtNs?: number): string {
  if (!expiresAtNs) return "EXPIRED / INACTIVE";
  const nowNs = Date.now() * 1_000_000;
  const diffSec = Math.floor((expiresAtNs - nowNs) / 1_000_000_000);
  if (diffSec <= 0) return "TIME-LOCK EXPIRED";

  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  return `${hours.toString().padStart(2, "0")}h ${minutes
    .toString()
    .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
}

/**
 * Formats a NEAR amount with specified decimal precision.
 */
export function formatNearDisplay(near: number, decimals: number = 2): string {
  return near.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Truncates an on-chain hash or sub-account identifier for UI display.
 */
export function truncateHash(hash: string, lead: number = 6, trail: number = 4): string {
  if (!hash || hash.length <= lead + trail) return hash;
  return `${hash.slice(0, lead)}...${hash.slice(-trail)}`;
}
