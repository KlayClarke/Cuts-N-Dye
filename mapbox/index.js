const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const findLocation = async (req, salon) => {
  const info = req.body.salon;
  const salonFullAddress = `${info.salonStreetAddress} ${info.salonCity}, ${info.salonState} ${info.salonZipCode}`;
  const geoData = await geocoder
    .forwardGeocode({ query: salonFullAddress, limit: 1 })
    .send()
    .then((response) => {
      return response;
    });
  const geoJSON = await JSON.parse(geoData.request.response.rawBody);
  const coordinates = geoJSON["features"][0]["geometry"];
  return coordinates;
};

module.exports = findLocation;
