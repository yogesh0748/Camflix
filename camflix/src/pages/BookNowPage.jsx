import React, { useEffect, useState } from "react";

export default function BookNowPage() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);

  const GOOGLE_API_KEY = "AIzaSyC54KPH6Urr_UdwXJIQZ21T5APXK1mAqC0"; // Replace with your key

  // Fetch user's city using Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
          );
          const data = await res.json();
          const addressComponents = data.results[0].address_components;
          const userCityObj = addressComponents.find((c) =>
            c.types.includes("locality")
          );
          const userCity = userCityObj ? userCityObj.long_name : "";
          setCity(userCity);
          setSearchCity(userCity);
        } catch (err) {
          console.error("Error getting city:", err);
        }
      });
    }
  }, []);

  // Fetch theaters from Google Places API
  useEffect(() => {
    if (!searchCity) return;

    const fetchTheaters = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=movie+theaters+in+${searchCity}&key=${GOOGLE_API_KEY}`
        );
        const data = await res.json();
        const theatersData = data.results.map((t) => ({
          id: t.place_id,
          name: t.name,
          address: t.formatted_address,
        }));
        setTheaters(theatersData);
      } catch (err) {
        console.error("Error fetching theaters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, [searchCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchCity(city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">Book Your Tickets 🎟️</h1>

      <form className="mb-6 flex flex-col md:flex-row gap-3" onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          className="px-4 py-2 rounded-md border border-red-500 bg-black text-white w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          type="submit"
          className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition font-semibold"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="text-gray-400">Loading theaters...</div>
      ) : theaters.length === 0 ? (
        <div className="text-gray-400">No theaters found in this city.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {theaters.map((theater) => (
            <div
              key={theater.id}
              className="bg-gray-800 rounded-lg p-4 shadow hover:scale-105 transform transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{theater.name}</h2>
              <p className="text-gray-300">{theater.address}</p>
              <button className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition">
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
