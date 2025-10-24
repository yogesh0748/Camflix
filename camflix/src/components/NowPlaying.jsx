import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function NowPlaying() {
  const [movies, setMovies] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // Router navigation

  const API_KEY = "e06052fa4ad5045e8528ae35b413daa0";
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/now_playing`, {
          params: { api_key: API_KEY, language: "en-US", page: 1 },
        });
        setMovies(res.data.results.slice(0, 10));
      } catch (err) {
        console.error(err);
      }
    };
    fetchNowPlaying();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="px-6 bg-gradient-to-r from-gray-900 via-black to-gray-900 py-6 relative">
      <h2 className="text-2xl font-bold text-white mb-4">Now Playing in Theaters 🎥</h2>

      {/* Scroll Buttons */}
      <button onClick={() => scroll("left")} className="hidden md:flex absolute left-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-lg z-10 hover:bg-red-700 transition">◀</button>
      <button onClick={() => scroll("right")} className="hidden md:flex absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-lg z-10 hover:bg-red-700 transition">▶</button>

      {/* Movie Cards */}
      <div ref={scrollRef} className="flex overflow-x-auto space-x-4 py-2 scrollbar-hide touch-pan-x px-2 md:px-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)} // Redirect on click
            className="relative min-w-[180px] md:min-w-[220px] bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer flex-shrink-0"
          >
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-56 object-cover" />
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-md shadow-md">⭐ {movie.vote_average.toFixed(1)}</div>
            <div className="p-3">
              <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">{movie.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
