import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function BookNowPage() {
  const [city, setCity] = useState(localStorage.getItem("currentCity") || "");
  const [cities, setCities] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🧠 Fetch all available cities (for dropdown)
  const fetchAllCities = useCallback(async () => {
    try {
      const citiesRef = collection(db, "cities");
      const snapshot = await getDocs(citiesRef);
      const cityList = snapshot.docs.map((doc) => doc.data().city);
      setCities(cityList);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to load cities.");
    }
  }, []);

  // 🎥 Fetch theaters by city name
  const fetchTheaters = useCallback(async (cityInput) => {
    if (!cityInput.trim()) {
      setError("Please select a city.");
      setTheaters([]);
      return;
    }

    setLoading(true);
    setError("");
    setTheaters([]);

    try {
      const citiesRef = collection(db, "cities");
      const snapshot = await getDocs(citiesRef);
      const matchedCity = snapshot.docs.find(
        (doc) => doc.data().city.toLowerCase() === cityInput.trim().toLowerCase()
      );

      if (!matchedCity) {
        setError("No theaters found for this city.");
      } else {
        const data = matchedCity.data();
        setTheaters(data.theaters || []);
      }
    } catch (err) {
      console.error("Error fetching theaters:", err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔁 When city changes (via dropdown or localStorage), fetch theaters
  useEffect(() => {
    if (city) {
      fetchTheaters(city);
    }
  }, [city, fetchTheaters]);

  // 📦 Load cities once on mount
  useEffect(() => {
    fetchAllCities();
  }, [fetchAllCities]);

  // 🏙 Handle dropdown change
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    localStorage.setItem("currentCity", selectedCity);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-8">
          🎬 Book Movie Tickets
        </h1>

        {/* 🔽 City Dropdown */}
        <div className="flex justify-center mb-8">
          <select
            value={city}
            onChange={handleCityChange}
            className="px-4 py-3 rounded-lg bg-black border-2 border-red-500 text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="">Select your city</option>
            {cities.map((c, idx) => (
              <option key={idx} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* ⚠️ Error Message */}
        {error && (
          <p className="text-center text-red-400 font-medium mb-6">{error}</p>
        )}

        {/* 🎭 Theater List */}
        {theaters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {theaters.map((t, index) => (
              <div
                key={index}
                className="bg-gray-900 p-5 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 border border-red-700"
              >
                <h2 className="text-xl font-semibold text-red-400">{t.name}</h2>
                <p className="text-gray-300 mt-2 text-sm">{t.address}</p>
                <p className="text-gray-400 text-sm mt-1">
                  🎟 Seats Available:{" "}
                  <span className="font-bold text-green-400">{t.seatsAvailable}</span>
                </p>
                <button className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                  Book Tickets
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ⏳ No theaters */}
        {!loading && !error && theaters.length === 0 && city && (
          <p className="text-center text-gray-400 mt-6">
            No theaters found for <span className="text-red-400">{city}</span>
          </p>
        )}
      </div>
    </div>
  );
}
