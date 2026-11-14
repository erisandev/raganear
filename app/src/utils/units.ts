/**
 * Converts yoctoNEAR string to a human-readable NEAR number.
 * Uses BigInt division with 4-decimal precision guarantee.
 */
export function yoctoToNear(yocto: string): number {
  if (!yocto || yocto === "0") return 0;
  try {
    const val = BigInt(yocto);
    const div = BigInt(10 ** 20);
    return Number(val / div) / 10000;
  } catch {
    return 0;
  }
}

/**
 * Converts a NEAR number to an exact yoctoNEAR string (1 NEAR = 10^24 yoctoNEAR).
 * Prevents precision loss on large floating point numbers.
 */
export function nearToYocto(near: number): string {
  const parts = near.toString().split(".");
  const whole = BigInt(parts[0] || "0") * BigInt(10 ** 24);
  const fractionStr = (parts[1] || "").slice(0, 24).padEnd(24, "0");
  const fraction = BigInt(fractionStr);
  return (whole + fraction).toString();
}
