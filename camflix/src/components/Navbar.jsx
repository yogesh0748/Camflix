import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

  const API_KEY = "e06052fa4ad5045e8528ae35b413daa0";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch movies when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/search/movie`, {
          params: { api_key: API_KEY, query: debouncedQuery, language: "en-US", page: 1 },
        });
        setResults(res.data.results.slice(0, 5));
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };
    fetchMovies();
  }, [debouncedQuery]);

  // Redirect when a movie is clicked
  const handleSelectMovie = (id) => {
    navigate(`/movie/${id}`);
    setQuery("");
    setResults([]);
  };

  return (
    <nav className="bg-gradient-to-b from-gray-900 to-black text-white px-6 py-3 flex flex-col md:flex-row justify-between items-center shadow-lg space-y-3 md:space-y-0">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-extrabold text-red-500 tracking-wide">Camflix</span>
        <span className="text-yellow-400 animate-pulse">🎬</span>
      </div>

      {/* Center: Links + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 w-full md:w-auto">
        <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
          <a href="#" className="hover:text-red-500 transition-colors duration-200">Home</a>
          <a href="#" className="hover:text-red-500 transition-colors duration-200">Movies</a>
          <a href="#" className="hover:text-red-500 transition-colors duration-200">Series</a>
          <a href="#" className="hover:text-red-500 transition-colors duration-200">Favorites</a>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2 md:mt-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Movies..."
            className="px-3 py-1.5 rounded-md w-64 bg-black border border-red-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {/* Search Dropdown */}
          {results.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-gray-800 border border-red-500 rounded-md mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
              {results.map((movie) => (
                <div
                  key={movie.id}
                  className="px-3 py-2 hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
                  onClick={() => handleSelectMovie(movie.id)}
                >
                  {movie.title}{" "}
                  <span className="text-gray-300 text-xs">
                    ({movie.release_date?.slice(0, 4)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Buttons */}
      <div className="flex space-x-3">
        <button className="border border-red-500 text-red-500 px-4 py-1.5 rounded-md hover:bg-red-500 hover:text-white transition-all duration-200">Login</button>
        <button className="bg-red-600 px-4 py-1.5 rounded-md hover:bg-red-700 transition-all duration-200">Sign Up</button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden mt-2">
        <button className="text-white text-2xl">☰</button>
      </div>
    </nav>
  );
}
