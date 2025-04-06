'use client';

import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import Link from "next/link";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [cate, setCate] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 30;

  useEffect(() => {
    const userJSON = localStorage.getItem("user");
    if (userJSON) {
      setUser(JSON.parse(userJSON));
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    if (cate === "Popular") {
      loadPopularMovies();
    } else if (cate === "ALL") {
      fetchAllMoviesFull(10); 
    }
  }, [cate]);
  
  
  const loadPopularMovies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      setMovies(data.results);
  
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMoviesFull = async (totalPages = 10) => {
    setIsLoading(true);
    try {
      const allResults: any[] = [];
      for (let page = 1; page <= totalPages; page++) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
        );
        const data = await res.json();
        allResults.push(...data.results);
      }
      setMovies(allResults);
      setRecommendedMovies(allResults.slice(0, 5));
    } catch (error) {
      console.error("Error fetching all movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      if (!query) {
        // Nếu query rỗng thì load lại theo cate hiện tại
        if (cate === "Popular") {
          return loadPopularMovies();
        } else {
          return fetchAllMoviesFull(10);
        }
      }
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}&language=en-US`
      );
      const data = await res.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xác định phim được hiển thị của trang hiện tại
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPagesCount = Math.ceil(movies.length / moviesPerPage);

  // Các hàm chuyển trang
  const handleNextPage = () => {
    if (currentPage < totalPagesCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-600 text-2xl font-bold">MOVIEFLIX</span>
          </div>
          <div className="w-1/2 max-w-md">
            <SearchBar onSearch={handleSearch} />
          </div>

          {!user ? (
            <div className="flex gap-4 items-center">
              <Link href="/login">
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                  Login
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  window.location.href = "/management";
                }}
                className="flex cursor-pointer items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="font-bold">{user.username.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium">{user.username}</span>
              </button>
              <div>
                <button
                  className="h-6 w-6 text-gray-400 hover:text-white mt-2 cursor-pointer"
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar trái */}
          <aside className="w-full lg:w-1/4 order-3 lg:order-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-red-500">Top Rated</h2>
              {!isLoading && (
                <div className="space-y-4">
                  {recommendedMovies.map((movie) => (
                    <div key={movie.id} className="flex gap-3 group cursor-pointer">
                      <div className="h-16 w-12 rounded overflow-hidden">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm group-hover:text-red-500 transition-colors">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span className="text-yellow-500">★</span>
                          <span>{movie.vote_average.toFixed(1)}</span>
                          <span>•</span>
                          <span>{movie.release_date?.split("-")[0]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Nội dung chính */}
          <div className="w-full lg:w-2/4 order-1 lg:order-2">
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">
                  {cate === "Popular" ? "Popular Movies" : "All Movies"}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCate("ALL")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      cate === "ALL" ? "bg-red-600 text-white" : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCate("Popular")}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      cate === "Popular" ? "bg-red-600 text-white" : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    Popular
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-800 rounded-lg aspect-[2/3]"></div>
                      <div className="h-4 bg-gray-800 rounded w-3/4 mt-2"></div>
                      <div className="h-3 bg-gray-800 rounded w-1/2 mt-2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {currentMovies.map((movie, index) => (
                  <MovieCard key={`${movie.id}-${index}`} movie={movie} />
                ))}
                </div>
              )}

              {/* Phân trang */}
              {!isLoading && totalPagesCount > 1 && (
                <div className="flex justify-center items-center gap-4 mt-20">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPagesCount}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPagesCount}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar phải */}
          <aside className="w-full lg:w-1/4 order-2 lg:order-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-red-500">Recommended Movies</h2>
              {!isLoading && (
                <div className="space-y-4">
                  {recommendedMovies.slice(0, 2).map((movie) => (
                    <div key={movie.id} className="group cursor-pointer">
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                          alt={movie.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium mt-2 group-hover:text-red-500 transition-colors">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span>
                          Coming {new Date(movie.release_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/80 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <h3 className="text-red-600 text-xl font-bold mb-4">MOVIEFLIX</h3>
              <p className="text-gray-400 text-sm">
                The ultimate destination for movie lovers. Watch your favorite films anytime, anywhere.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Categories</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Action</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Comedy</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Drama</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Horror</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Help</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-red-500 cursor-pointer transition-colors">FAQ</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Contact Us</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Terms of Use</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Privacy Policy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Follow Us</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Facebook</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Twitter</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">Instagram</li>
                  <li className="hover:text-red-500 cursor-pointer transition-colors">YouTube</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2025 MovieFlix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
