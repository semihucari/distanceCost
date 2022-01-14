import Axios, { AxiosResponse } from "axios";
import { Geocode, LatLng, RouteResponse } from "../constants";

export class Rest 
{
  public static async route(origin: LatLng, destination: LatLng): Promise<RouteResponse>
  {
      const response: AxiosResponse<RouteResponse> = await Axios.get(`http://router.project-osrm.org/route/v1/driving/${
        origin.lat},${origin.lng};${destination.lat},${destination.lng}?steps=true&overview=false`);
      return response.data;
  }

  public static async geoCode(name: string): Promise<Geocode>
  {
      const response: AxiosResponse<Geocode> = await Axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${
        name}.json?access_token=pk.eyJ1Ijoic2VtaWh1Y2FyaSIsImEiOiJjanRxcm1tNTAwY3B2NDRxZHNhcnlnbnluIn0.JLo1IwjIwPzfRqAt2ZcPwQ`);
      return response.data;
  }
}