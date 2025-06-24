import { MonthData } from "@mtronic-llc/fahs-common-test";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface AvailabilityDates {
  checkin: string;
  checkout: string;
  availabilityPercent: number;
}

interface MonthAvailability {
  year: number;
  month: number;
  availabilityPercentage: number;
}

interface Availability {
  nextSixMonths: number;
  months: MonthAvailability[];
}

export interface AvailablePlace {
  airbnb_id: string;
  pricePerNight: string;
  totalPrice: string;
  city: string;
  localizedCity: string;
  name: string;
  accommodationType: string;
  coordinates: Coordinates;
  averageRating: string;
  picturesUrl: string[];
  availabilityDates: AvailabilityDates;
  inCoda?: boolean;
  rejected?: boolean;
  queryCity: {
    name: string;
    id: string;
  };
  monthAvailability: MonthData[];
}