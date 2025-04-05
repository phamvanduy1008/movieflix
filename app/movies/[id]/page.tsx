import Link from 'next/link';



export default async function MovieDetail({ params }: { params: { id: string } }) {
  const id = (await params).id; 

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,similar`
  );
  const movie = await res.json();
  // Lấy thông tin cast

  const cast = movie.credits?.cast?.slice(0, 6) || [];
  
  // Lấy trailer (nếu có)
  const trailer = movie.videos?.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );
  
  // Phim tương tự
  const similarMovies = movie.similar?.results?.slice(0, 4) || [];

  // Format thời lượng phim
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format ngày phát hành
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format doanh thu
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Header/Nav */}
      <header className="bg-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-red-600 text-2xl font-bold cursor-pointer">MOVIEFLIX</span>
          </Link>
          <Link href="/">
            <button className="bg-transparent hover:bg-red-600/10 border border-red-600 text-red-500 px-4 py-2 rounded-full text-sm font-medium transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </header>

      {/* Movie hero section with backdrop */}
      <div
        className="relative w-full h-[50vh] lg:h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r to-transparent"></div>
        
        {/* Movie info overlay */}
        <div className="container mx-auto px-4 h-full flex items-end pb-16">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="hidden md:block w-64 h-96 rounded-lg overflow-hidden shadow-2xl shadow-black/60">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Details */}
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.genres?.map((genre: any) => (
                  <span 
                    key={genre.id} 
                    className="px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl  font-bold mb-2">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-lg text-gray-400 italic mb-4">"{movie.tagline}"</p>
              )}
              
              <div className="flex items-center gap-4 text-sm mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{movie.vote_average?.toFixed(1)}/10</span>
                </div>
                <span>•</span>
                <span>{movie.release_date ? formatDate(movie.release_date) : 'TBA'}</span>
                {movie.runtime > 0 && (
                  <>
                    <span>•</span>
                    <span>{formatRuntime(movie.runtime)}</span>
                  </>
                )}
              </div>
              
              <div className="flex gap-4">
              <button className="bg-red-600 cursor-pointer hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Trailer
            </button>

                <button className="bg-gray-800 cursor-pointer hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Add to Favorites
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Movie details */}
          <div className="w-full lg:w-2/3">
            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </section>
            
            {/* Cast */}
            {cast.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Top Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {cast.map((person: any) => (
                    <div key={person.id} className="text-center">
                      <div className="aspect-square rounded-full overflow-hidden bg-gray-800 mb-2">
                        {person.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-sm">{person.name}</h3>
                      <p className="text-xs text-gray-400">{person.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Trailer */}
            {trailer && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${movie.title} Trailer`}
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </section>
            )}
            
            {/* Similar Movies */}
            {similarMovies.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Similar Movies</h2>
                  <Link href="/">
                    <span className="text-red-500 text-sm hover:underline cursor-pointer">See All</span>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {similarMovies.map((similarMovie: any) => (
                    <Link href={`/movies/${similarMovie.id}`} key={similarMovie.id}>
                      <div className="group cursor-pointer">
                        <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 mb-2">
                          {similarMovie.poster_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`}
                              alt={similarMovie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              No Image
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium group-hover:text-red-500 transition-colors line-clamp-1">
                          {similarMovie.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span>{similarMovie.vote_average?.toFixed(1)}</span>
                          <span className="mx-1">•</span>
                          <span>{similarMovie.release_date?.split('-')[0]}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          {/* Right column - Additional Info */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Movie Info</h2>
              
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className="font-medium">{movie.status}</span>
                </li>
                
                <li className="flex flex-col">
                  <span className="text-gray-400 text-sm">Original Language</span>
                  <span className="font-medium">
                    {new Intl.DisplayNames(['en'], { type: 'language' }).of(movie.original_language)}
                  </span>
                </li>
                
                {movie.budget > 0 && (
                  <li className="flex flex-col">
                    <span className="text-gray-400 text-sm">Budget</span>
                    <span className="font-medium">{formatCurrency(movie.budget)}</span>
                  </li>
                )}
                
                {movie.revenue > 0 && (
                  <li className="flex flex-col">
                    <span className="text-gray-400 text-sm">Revenue</span>
                    <span className="font-medium">{formatCurrency(movie.revenue)}</span>
                  </li>
                )}
                
                {movie.production_companies?.length > 0 && (
                  <li className="flex flex-col">
                    <span className="text-gray-400 text-sm">Production</span>
                    <span className="font-medium">
                      {movie.production_companies.map((company: any) => company.name).join(', ')}
                    </span>
                  </li>
                )}
              </ul>
              
              <div className="mt-8">
                <button className="bg-green-600 hover:bg-green-700 cursor-pointer text-white w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Buy Movie
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">Includes HD streaming and download</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-black/80 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © 2025 MovieFlix. All rights reserved.
        </div>
      </footer>
    </div>
  );
}