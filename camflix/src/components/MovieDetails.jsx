import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MovieDetails({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  const API_KEY = "e06052fa4ad5045e8528ae35b413daa0";
  const BASE_URL = "https://api.themoviedb.org/3";

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
          params: { api_key: API_KEY, language: "en-US" },
        });
        setMovie(res.data);
      } catch (err) {
        console.error("Error fetching movie details:", err);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  // Fetch trailer
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
          params: { api_key: API_KEY, language: "en-US" },
        });
        const trailer = res.data.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);
      } catch (err) {
        console.error("Error fetching trailer:", err);
      }
    };
    fetchTrailer();
  }, [movieId]);

  if (!movie)
    return <div className="text-white text-center mt-10">Loading movie details...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 px-6 py-6 text-white">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
        >
          ← Back
        </button>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg shadow-lg"
        />

        {/* Movie Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-gray-400 italic mb-4">{movie.tagline}</p>
            )}
            <p className="mb-2">
              <span className="font-semibold">Rating:</span> ⭐ {movie.vote_average.toFixed(1)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Release Date:</span> {movie.release_date}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Runtime:</span> {movie.runtime} min
            </p>
            <p className="mb-2">
              <span className="font-semibold">Genres:</span> {movie.genres.map((g) => g.name).join(", ")}
            </p>
            <p className="mt-4 text-gray-200">{movie.overview}</p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            {/* Navigate to BookNowPage */}
            <button
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md font-semibold transition"
              onClick={() =>
                navigate("/book-now", { state: { movieId: movie.id, movieTitle: movie.title } })
              }
            >
              Book Now 🎟️
            </button>

            {/* Watch Trailer */}
            {trailerKey ? (
              <button
                className="bg-gray-800 border border-red-600 hover:bg-red-600 hover:text-white px-6 py-2 rounded-md font-semibold transition"
                onClick={() => setShowTrailer(true)}
              >
                Watch Trailer ▶️
              </button>
            ) : (
              <span className="px-6 py-2 rounded-md bg-gray-700 text-gray-300 font-semibold">
                Trailer not available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl bg-black rounded-lg overflow-hidden animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-red-600"
              onClick={() => setShowTrailer(false)}
            >
              ×
            </button>

            {/* YouTube Video */}
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
