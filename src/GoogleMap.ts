import { Client, LatLng, TravelMode } from '@googlemaps/google-maps-services-js';
import 'dotenv/config';

const client = new Client({});

export default class GoogleMap {
  static async directions(origin: LatLng, destination: LatLng) {
    const response = await client.directions({
      params: {
        origin,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY,
        mode: TravelMode.transit
      },
      timeout: 1000
    });
    return response.data;
  }
}
