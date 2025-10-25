import { useEffect } from "react";
import axios from "axios";

export default function CurrentCity() {
  const API_KEY = "e03f54b5b7f7525319f77a22edd864fe";

  const getLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }
    // Browser will automatically ask for permission
    navigator.geolocation.getCurrentPosition(fetchCity, handleError);
  };

  const fetchCity = async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const cityName = response.data.name;
      if (cityName) {
        localStorage.setItem("currentCity", cityName);
        console.log("✅ Current city stored:", cityName);
      } else {
        console.warn("City not found in API response.");
      }
    } catch (err) {
      console.error("Failed to fetch city name:", err);
    }
  };

  const handleError = (err) => {
    if (err.code === 1) {
      console.error("User denied location permission.");
    } else {
      console.error("Unable to retrieve location.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return null; // 🔹 No UI rendering
}
