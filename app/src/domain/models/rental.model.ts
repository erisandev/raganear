export interface ActiveRental {
  renter_id: string;
  expires_at: number; // nanoseconds timestamp
}

export interface RentalTerms {
  durationHours: number;
  durationSec: number;
  hourlyRateNear: number;
  totalCostNear: string;
}

export interface LeaseDurationOption {
  label: string;
  hours: number;
}
