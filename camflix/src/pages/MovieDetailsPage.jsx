import React from "react";
import { useParams } from "react-router-dom";
import MovieDetails from "../components/MovieDetails";
import Navbar from "../components/Navbar";

export default function MovieDetailsPage() {
  const { id } = useParams();

  return (
    <div>

      <MovieDetails movieId={id} onBack={null} />
    </div>
  );
}
