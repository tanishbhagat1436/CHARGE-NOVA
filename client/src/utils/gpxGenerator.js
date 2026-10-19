/**
 * GPX (GPS Exchange Format) Generator for Offline Navigation & Car Infotainment
 * Compatible with Android Auto, Apple CarPlay GPX readers, Garmin, and OSMAnd.
 */

export const generateGpxString = ({
  routeData,
  stops = [],
  sourceName = 'Origin',
  destName = 'Destination',
  waypoints = [],
  vehicleName = 'Electric Vehicle'
}) => {
  const timestamp = new Date().toISOString();
  const safeSource = sourceName.replace(/[<>&"]/g, '');
  const safeDest = destName.replace(/[<>&"]/g, '');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="ChargeNova EV Smart Highway Planner"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2000/svg"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>EV Route: ${safeSource} to ${safeDest}</name>
    <desc>ChargeNova EV Highway Corridor with Smart Charging Halts for ${vehicleName}. Total Distance: ${routeData?.distanceKm || 0} km</desc>
    <time>${timestamp}</time>
  </metadata>
`;

  // Origin Waypoint
  if (routeData?.coordinates?.[0]) {
    const [startLat, startLng] = routeData.coordinates[0];
    xml += `  <wpt lat="${startLat}" lon="${startLng}">
    <name>Start: ${safeSource}</name>
    <sym>Flag, Green</sym>
    <type>Origin</type>
  </wpt>\n`;
  }

  // Intermediate Waypoints
  (waypoints || []).forEach((wp, idx) => {
    if (wp?.location?.lat && wp?.location?.lng) {
      const name = (wp.location.displayName || `Via Stop ${idx + 1}`).replace(/[<>&"]/g, '');
      xml += `  <wpt lat="${wp.location.lat}" lon="${wp.location.lng}">
    <name>Stop #${idx + 1}: ${name}</name>
    <sym>Waypoint</sym>
    <type>Via</type>
  </wpt>\n`;
    }
  });

  // Recommended EV Fast Charging Halts
  (stops || []).forEach((st, idx) => {
    const stationName = (st.name || st.title || `Fast Charger #${idx + 1}`).replace(/[<>&"]/g, '');
    const op = (st.operator || 'EV Network').replace(/[<>&"]/g, '');
    xml += `  <wpt lat="${st.lat}" lon="${st.lng}">
    <name>⚡ ${op} - ${stationName}</name>
    <desc>Recommended Charge Stop: ~${st.chargeTimeMins || 30} mins (${st.arrivalSocPercent || 15}% to ${st.departureSocPercent || 85}% SoC). Power: ${st.power || 60} kW DC.</desc>
    <sym>Gas Station</sym>
    <type>ChargingStation</type>
  </wpt>\n`;
  });

  // Destination Waypoint
  if (routeData?.coordinates && routeData.coordinates.length > 0) {
    const [destLat, destLng] = routeData.coordinates[routeData.coordinates.length - 1];
    xml += `  <wpt lat="${destLat}" lon="${destLng}">
    <name>Destination: ${safeDest}</name>
    <sym>Flag, Red</sym>
    <type>Destination</type>
  </wpt>\n`;
  }

  // Full Route Track
  if (routeData?.coordinates && routeData.coordinates.length > 0) {
    xml += `  <trk>
    <name>${safeSource} to ${safeDest} Highway Corridor</name>
    <desc>Calculated by ChargeNova EV Planner</desc>
    <trkseg>\n`;

    routeData.coordinates.forEach(([lat, lng]) => {
      xml += `      <trkpt lat="${lat}" lon="${lng}"></trkpt>\n`;
    });

    xml += `    </trkseg>
  </trk>\n`;
  }

  xml += `</gpx>`;
  return xml;
};

/**
 * Trigger immediate browser download of GPX file
 */
export const downloadGpxFile = (routeDetails) => {
  const gpxContent = generateGpxString(routeDetails);
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const fileName = `ChargeNova_${(routeDetails.sourceName || 'Origin').split(',')[0].replace(/\s+/g, '_')}_to_${(routeDetails.destName || 'Destination').split(',')[0].replace(/\s+/g, '_')}.gpx`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
