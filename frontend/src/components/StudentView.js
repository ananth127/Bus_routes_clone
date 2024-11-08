import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';

// Set up the icon for the bus marker
const busIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const collegeLocation = [10.95628961382053, 77.95483683491189]; // College location

const StudentView = ({ busId }) => {
  const [busLocation, setBusLocation] = useState(null);
  const [routeControl, setRouteControl] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`https://bus-routes-ywvb.vercel.app/api/bus/location/${busId}`);
        const { latitude, longitude } = response.data;
        setBusLocation([latitude, longitude]);
      } catch (error) {
        console.error("Error fetching bus location:", error);
      }
    };

    fetchLocation();
    const intervalId = setInterval(fetchLocation, 2000); // Update every 2 seconds

    return () => clearInterval(intervalId);
  }, [busId]);

  const createRoute = (map, busLocation, collegeLocation) => {
    if (routeControl) {
      routeControl.setWaypoints([L.latLng(busLocation), L.latLng(collegeLocation)]);
    } else {
      const newRouteControl = L.Routing.control({
        waypoints: [L.latLng(busLocation), L.latLng(collegeLocation)],
        routeWhileDragging: false,
        createMarker: () => null, // Disable markers on the route
      }).addTo(map); // Add the route to the map
      setRouteControl(newRouteControl);
    }
  };

  // Component to manage the route on the map
  const MapRoute = ({ busLocation, collegeLocation }) => {
    const map = useMap();

    useEffect(() => {
      if (busLocation) {
        createRoute(map, busLocation, collegeLocation);
      }
    }, [busLocation, map]);

    return null;
  };

  return (
    <div>
      <h2>Student View - Track Bus Route to College</h2>
      <MapContainer center={collegeLocation} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {busLocation && (
          <Marker position={busLocation} icon={busIcon}>
            <Popup>Bus Location</Popup>
          </Marker>
        )}
        <Marker position={collegeLocation}>
          <Popup>College Location</Popup>
        </Marker>
        {busLocation && (
          <MapRoute busLocation={busLocation} collegeLocation={collegeLocation} />
        )}
      </MapContainer>
    </div>
  );
};

export default StudentView;
