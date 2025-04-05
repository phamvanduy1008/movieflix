'use client';

import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        const data = await res.json();
        setMovies(data.results);
        
        setRecommendedMovies(data.results.slice(0, 5));

      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      if (!query) {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        const data = await res.json();
        setMovies(data.results);
        return;
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
          <div className="flex gap-4 items-center">
            <button className="text-sm hover:text-red-500 transition-colors">Login</button>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-medium transition-colors">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar trái (Recommended Movies) */}
          <aside className="w-full lg:w-1/4 order-3 lg:order-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-red-500">Top Rated</h2>
              {isLoading ||(
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
                        <h3 className="font-medium text-sm group-hover:text-red-500 transition-colors">{movie.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span className="text-yellow-500">★</span>
                          <span>{movie.vote_average.toFixed(1)}</span>
                          <span>•</span>
                          <span>{movie.release_date?.split('-')[0]}</span>
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
                <h1 className="text-2xl font-bold">Popular Movies</h1>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
                    Popular
                  </button>
                  <button className="px-3 py-1 rounded-full text-sm hover:bg-gray-800 transition-colors">
                    New Releases
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
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar phải (Recommended Movies) */}
          <aside className="w-full lg:w-1/4 order-2 lg:order-3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-red-500">Recommended Movies</h2>
              <div className="space-y-4">
                {isLoading || (
                  recommendedMovies.slice(0, 1).map((movie) => (
                    <div key={movie.id} className="group cursor-pointer">
                      <div className="rounded-lg overflow-hidden">
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
                          alt={movie.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium mt-2 group-hover:text-red-500 transition-colors">{movie.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span>Coming {new Date(movie.release_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
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