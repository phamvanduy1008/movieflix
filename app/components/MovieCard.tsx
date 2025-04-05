import React from 'react';
import Link from 'next/link';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    genre_ids?: number[];
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  // Chức năng hiển thị thể loại (có thể mở rộng sau này)
  const getGenreName = (id: number) => {
    const genres: Record<number, string> = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Sci-Fi',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };
    return genres[id] || '';
  };

  return (
    <div className="group transition-all duration-300 hover:scale-[1.02]">
      <div className="relative rounded-lg overflow-hidden shadow-lg shadow-black/40">
        {/* Backdrop poster */}
        <div className="aspect-[2/3] bg-gray-800">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity ">
          <div className="absolute bottom-5 left-0 p-3 w-full">
            <Link href={`/movies/${movie.id}`}>
              <button className="bg-red-600 hover:bg-red-700 cursor-pointer text-white rounded-full w-full py-2 font-medium text-sm transition-colors">
                Detail
              </button>
            </Link>
          </div>
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex items-center gap-1">
          <span className="text-yellow-500 text-xs">★</span>
          <span className="text-white text-xs font-medium">{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
      
      {/* Movie info */}
      <div className="mt-2">
        <Link href={`/movies/${movie.id}`}>
          <h2 className="font-semibold text-white group-hover:text-red-500 transition-colors line-clamp-1">{movie.title}</h2>
        </Link>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{movie.release_date?.split('-')[0] || 'TBA'}</span>
          {movie.genre_ids && movie.genre_ids.length > 0 && (
            <span className="bg-gray-800 px-2 py-0.5 rounded-full">
              {getGenreName(movie.genre_ids[0])}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;