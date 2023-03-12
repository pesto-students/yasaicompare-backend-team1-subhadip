import haversine from 'haversine-distance';

const getDistanceOfShop = (userLocation, shopLocation) => {
  /**
   * Object = {latitude: <value>, longitude: <value>}
   */

  const distance = haversine(userLocation, shopLocation);
  return distance; // in meters
};

export default { getDistanceOfShop };
