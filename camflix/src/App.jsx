import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NowPlaying from "./components/NowPlaying";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import MovieCarousel from "./components/MovieCarousel";
import BookNowPage from "./pages/BookNowPage";
import { uploadTheaterData } from "./uploadTheaterData";
import { useEffect } from "react";
import Currentcity from "./components/Currentcity";

function App() {
 
    useEffect(() => {
      uploadTheaterData(); // run once to upload data
      console.log("Theater data upload initiated.");
    }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Currentcity />
              <MovieCarousel />
              <NowPlaying />
            </>
          }
        />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/book-now" element={<BookNowPage />} />
      </Routes>
    </Router>
  );
}

export default App;
