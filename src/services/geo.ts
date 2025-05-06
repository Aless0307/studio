/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Address {
  /**
   * The latitude of the location.
   */
  address: string;
}

/**
 * Represents coordinates.
 */
export interface Coordinates {
  /**
   * The temperature in Fahrenheit.
   */
  latitude: number;
  /**
   * The weather conditions (e.g., Sunny, Cloudy, Rainy).
   */
  longitude: number;
}

/**
 * Asynchronously retrieves coordinates information for a given address.
 *
 * @param address The address for which to retrieve coordinate data.
 * @returns A promise that resolves to a Coordinate object containing latitude and longitude.
 */
export async function getCoordinates(address: Address): Promise<Coordinates> {
  // TODO: Implement this by calling an API.

  return {
    latitude: 34.052235,
    longitude: -118.243683,
  };
}
