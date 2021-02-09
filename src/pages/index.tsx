import { useEffect, useState } from "react";

export default function Home() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      pos => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      err => {
        setLatitude(-1);
        setLongitude(-1);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  return (
    <>
      <div>Home</div>
      <h1>Latitude: {latitude}</h1>
      <h1>Longitude: {longitude}</h1>
    </>
  );
}
