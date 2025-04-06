'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids?: number[];
}

const RecommenderDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([
    { timestamp: '2025-04-06 12:30:45', action: 'Watched "Dune: Part Two" for 25 minutes' },
    { timestamp: '2025-04-06 11:15:22', action: 'Searched for "action movies"' },
    { timestamp: '2025-04-05 20:45:12', action: 'Added "The Batman" to watchlist' },
    { timestamp: '2025-04-05 19:30:05', action: 'Rated "Oppenheimer" 4.5 stars' },
    { timestamp: '2025-04-05 18:20:18', action: 'Completed watching "Poor Things"' },
  ]);

  const algorithms = [
    { name: 'Content-Based Filtering', id: 'content-based' },
    { name: 'Collaborative Filtering', id: 'collaborative' },
    { name: 'Hybrid Recommender', id: 'hybrid' },
    { name: 'Matrix Factorization', id: 'matrix' },
    { name: 'Deep Learning Recommender', id: 'deep-learning' },
    { name: 'Contextual Recommender', id: 'contextual' },
  ];
  useEffect(() => {
    const userJSON = localStorage.getItem("user");
    if (userJSON) {
      setUser(JSON.parse(userJSON));
      console.log("userJSON", userJSON);
    }
  }, []);


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        setMovies(data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const getMoviesForAlgorithm = () => {
    if (movies.length === 0) return [];
    const shuffled = [...movies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      <header className="bg-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-red-600 text-2xl font-bold cursor-pointer">MOVIEFLIX</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="bg-red-600 w-2 h-2 absolute top-0 right-0 rounded-full"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="font-bold">{user.username.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium">{user.username}</span>
            </div>)}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <section className="bg-gray-800/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">User Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50 text-left">
                  <tr>
                    <th className="p-3 rounded-l-lg">Timestamp</th>
                    <th className="p-3 rounded-r-lg">Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-700/30">
                      <td className="p-3 text-gray-400">{log.timestamp}</td>
                      <td className="p-3">{log.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <h2 className="text-2xl font-bold mb-2">Recommendation Algorithms</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {algorithms.map((algorithm) => (
                <section key={algorithm.id} className="bg-gray-800/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{algorithm.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {getMoviesForAlgorithm().map((movie) => (
                      <Link href={`/movies/${movie.id}`} key={movie.id}>
                        <div className="group cursor-pointer w-60 h-110 bg-gray-800/30 rounded-lg overflow-hidden hover:bg-gray-700/30 transition-colors">
                          <div className="aspect-[2/3] relative overflow-hidden">
                            <img 
                              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                              <span className="inline-flex items-center bg-red-600/80 text-white text-xs px-2 py-1 rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {movie.vote_average.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium group-hover:text-red-500 transition-colors line-clamp-1">
                              {movie.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <span>{movie.release_date?.split('-')[0] || 'TBA'}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-black/80 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2025 MovieFlix. All rights reserved. | Recommender System Dashboard
        </div>
      </footer>
    </div>
  );
};

export default RecommenderDashboard;
