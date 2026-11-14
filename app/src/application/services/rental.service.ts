import { RentalTerms } from "@/domain/models/rental.model";

/**
 * Validates that requested rental duration conforms to protocol rules (>= 1 hour, positive integer).
 */
export function validateRentalDuration(hours: number): boolean {
  return typeof hours === "number" && hours >= 1 && Number.isFinite(hours);
}

/**
 * Calculates rental cost and duration terms for a given agent.
 */
export function calculateRentalTerms(hourlyRateNear: number, durationHours: number): RentalTerms {
  const durationSec = durationHours * 3600;
  const totalCostNear = (hourlyRateNear * durationHours).toFixed(4);
  return {
    durationHours,
    durationSec,
    hourlyRateNear,
    totalCostNear,
  };
}

/**
 * Checks whether an agent's active lease has not yet reached its expiration timestamp.
 */
export function isLeaseActive(expiresAtNs?: number): boolean {
  if (!expiresAtNs) return false;
  const nowNs = Date.now() * 1_000_000;
  return expiresAtNs > nowNs;
}

/**
 * Returns the milliseconds remaining until rental lease expiration.
 */
export function getRemainingLeaseMs(expiresAtNs?: number): number {
  if (!expiresAtNs) return 0;
  const nowNs = Date.now() * 1_000_000;
  const diffNs = expiresAtNs - nowNs;
  return diffNs > 0 ? Math.floor(diffNs / 1_000_000) : 0;
}
