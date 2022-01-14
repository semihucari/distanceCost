export enum CalculationType
{
  Distance = "Distance",
  Coordinates = "Coordinates",
  Names = "Location names"
}

export type LatLng = {
  lat: number;
  lng: number;
}

export type AppState = {
  destination?: LatLng;
  origin?: LatLng;
  distance?: number | string;
  totalCost?: number;
  calculationType: CalculationType;
  roadMap?: [number, number][];
}

export type Geocode =
{
  features: GeocodeFeature[]
}

export type GeocodeFeature = {
  center: [number, number]
}

export type RouteLeg = {
  "distance": number,
  "duration": number,
  "steps": RouteStep[]
}

export type Route = {
  "distance": number,
  "duration": number,
  "legs": RouteLeg[];
}

export type RouteResponse = {
  routes: Route[];
}

export type RouteStep = {
  "intersections": RouteIntersection[]
}

export type RouteIntersection = {
  "location": [number, number],
}