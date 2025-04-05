'use client';

import { useState } from "react";

export default function Management() {
  const [likedMovies, setLikedMovies] = useState([
    { title: "Inception", year: 2010, genre: "Sci-Fi" },
    { title: "The Matrix", year: 1999, genre: "Action" },
    { title: "Interstellar", year: 2014, genre: "Sci-Fi" },
    { title: "The Dark Knight", year: 2008, genre: "Action" },
  ]); // Dữ liệu giả lập về các bộ phim yêu thích

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-4">Movie Management</h1>
        <h2 className="text-xl text-gray-600 text-center zmb-10">Liked Movies</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {likedMovies.map((movie, index) => (
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out" key={index}>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-600">
                Year: {movie.year} | Genre: {movie.genre}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
