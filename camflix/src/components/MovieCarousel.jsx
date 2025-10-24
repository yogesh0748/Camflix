import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MovieCarousel() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);

  const API_KEY = "e06052fa4ad5045e8528ae35b413daa0";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Fetch upcoming movies
  useEffect(() => {
    axios
      .get(`${BASE_URL}/movie/upcoming`, {
        params: {
          api_key: API_KEY,
          language: "en-US",
          page: 1,
        },
      })
      .then((res) => setMovies(res.data.results.slice(0, 8))) // limit to 8 movies
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 4000); // 4 seconds delay
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0)
    return (
      <div className="text-center text-gray-400 mt-10">
        Loading upcoming movies...
      </div>
    );

  return (
    <>
      {/* ===== Movie Carousel ===== */}
      <div className="relative w-full h-[70vh] overflow-hidden bg-black">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Poster */}
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              className="w-full h-full object-cover opacity-80"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Movie Info */}
            <div className="absolute bottom-16 left-10 text-white max-w-xl">
              <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
                {movie.title}
              </h2>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {movie.overview}
              </p>
              <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md text-sm font-semibold shadow-lg">
                Watch Trailer 🎬
              </button>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {movies.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === current ? "bg-red-600" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ===== Gradient Section Below Carousel ===== */}
      <div className="w-full py-8 bg-gradient-to-r from-gray-900 via-black to-gray-900 flex flex-col items-center space-y-6">
        <h3 className="text-2xl font-bold text-white">Browse by Category</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "Action",
            "Comedy",
            "Drama",
            "Horror",
            "Sci-Fi",
            "Romance",
            "Thriller",
            "Animation",
          ].map((category) => (
            <button
              key={category}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 shadow-md"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
