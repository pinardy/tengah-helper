// Types for the LTA DataMall v3 BusArrival API.
// https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=XXXXX

/** Bus occupancy: Seats Available / Standing Available / Limited Standing */
export type Load = "SEA" | "SDA" | "LSD";

/** Single Deck / Double Deck / Bendy */
export type BusType = "SD" | "DD" | "BD";

export interface NextBus {
  OriginCode: string;
  DestinationCode: string;
  /** ISO 8601 with +08:00 offset, or "" when there is no further bus */
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: Load;
  /** "WAB" = wheelchair accessible, "" otherwise */
  Feature: "WAB" | "";
  Type: BusType;
}

export interface BusService {
  ServiceNo: string;
  Operator: string;
  NextBus: NextBus;
  NextBus2: NextBus;
  NextBus3: NextBus;
}

export interface BusArrivalResponse {
  BusStopCode: string;
  Services: BusService[];
}

export interface ApiError {
  error: string;
}
