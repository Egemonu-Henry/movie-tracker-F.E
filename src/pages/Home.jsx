
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../component/movieCard";
// import movieCard from "../component/movieCard";


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const Home = ({ user, error }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [movieError, setMovieError] = useState(null);
  const [trending, setTrending] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("movieWatchlist");
      if (saved) setWatchlist(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load watchlist:", err);
    }
  }, []);

  // Save watchlist whenever it changes
  useEffect(() => {
    localStorage.setItem("movieWatchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrending = async () => {
      setTrendingLoading(true);

      try {
        const response = await fetch(
          `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setTrending(data.results || []);
      } catch (err) {
        console.error("Failed to fetch trending movies:", err);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const fetchMovies = async (searchQuery) => {
    if (!API_KEY) {
      setMovieError("TMDB API key is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMovieError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setMovieError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Search movies with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setLoading(false);
      setMovieError(null);
      return;
    }

    const timerId = setTimeout(() => {
      fetchMovies(query);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [query]);

  

  // Add movie to watchlist
  const addToWatchlist = (movie) => {
    setWatchlist((prev) => {
      if (prev.some((item) => item.id === movie.id)) return prev;

      return [
        ...prev,
        {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          overview: movie.overview,
          vote_average: movie.vote_average,
          watched: false,
        },
      ];
    });
  };

  // Remove movie from watchlist
  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  // Toggle watched status
  const toggleWatched = (movieId) => {
    setWatchlist((prev) =>
      prev.map((movie) =>
        movie.id === movieId
          ? { ...movie, watched: !movie.watched }
          : movie
      )
    );
  };

  // Filter watchlist
  const filteredWatchlist = watchlist.filter((movie) => {
    if (filter === "watched") return movie.watched;
    if (filter === "unwatched") return !movie.watched;
    return true;
  });

  const sectionTitle = "mb-4 text-xl font-bold text-white";
  const movieGrid =
    "grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5";
  const statusMsg = "py-5 text-center text-gray-200";
  const filterBtn = (active) =>
    `rounded-md border px-4 py-1.5 text-sm transition ${
      active
        ? "border-white bg-white text-amber-700"
        : "border-amber-400 text-white hover:bg-amber-600"
    }`;

  return (
      <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#1a1a1a] to-[#010101] px-5 py-10 text-white">
        
      <div className="mx-auto max-w-6xl">
        {error && (
          <p className="mb-4 text-sm text-red-300">{error}</p>
        )}

        {user ? (
          <div>
            <div className="mb-8 border-b border-amber-500 pb-5">
              <h1 className="mb-2 text-3xl font-bold">
                Welcome, {user.username}!
              </h1>
              <p className="text-amber-100">{user.email}</p>
            </div>

            {/* Trending Movies */}
            {!query.trim() && (
              <section className="border-b border-amber-500 py-6">
                <h2 className={sectionTitle}>Trending Today</h2>

                {trendingLoading ? (
                  <p className={statusMsg}>Loading trending movies...</p>
                ) : (
                  <div className={movieGrid}>
                    {trending.map((movie) => (
                        <MovieCard
                          key={movie.id}
                        movie={movie}
                        actionLabel="+ Add to Watchlist"
                        onAction={() => addToWatchlist(movie)}
                        />
                      
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Search Movies */}
            <section id="search-section" className="border-b border-amber-500 py-6 scroll-mt-24">
              <h2 className={sectionTitle}>Search Movies</h2>

              <input
                className="mb-4 w-full rounded-lg border border-amber-400 bg-amber-800 px-4 py-3 text-white outline-none placeholder:text-amber-200 focus:border-white"
                type="text"
                placeholder="Search for a movie..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {loading && <p className={statusMsg}>Searching...</p>}

              {movieError && (
                <p className="py-3 text-red-300">{movieError}</p>
              )}

              <div className={movieGrid}>
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    actionLabel="+ Add to Watchlist"
                    onAction={() => addToWatchlist(movie)}
                  />
                ))}
              </div>
            </section>

            {/* My Watchlist */}
            <section className="py-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">
                  My Watchlist ({filteredWatchlist.length})
                </h2>

                <div className="flex gap-2">
                  <button
                    className={filterBtn(filter === "all")}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>

                  <button
                    className={filterBtn(filter === "watched")}
                    onClick={() => setFilter("watched")}
                  >
                    Watched
                  </button>

                  <button
                    className={filterBtn(filter === "unwatched")}
                    onClick={() => setFilter("unwatched")}
                  >
                    Unwatched
                  </button>
                </div>
              </div>

              {filteredWatchlist.length === 0 ? (
                <p className="py-10 text-center text-amber-100">
                  {watchlist.length === 0
                    ? "Your watchlist is empty. Search for movies to add!"
                    : "No movies match this filter."}
                </p>
              ) : (
                <div className={movieGrid}>
                  {filteredWatchlist.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isWatchlist={true}
                      onToggleWatched={() => toggleWatched(movie.id)}
                      onRemove={() => removeFromWatchlist(movie.id)}
                    />
                    
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="mb-3 text-3xl font-bold">
              My Movies Tracker
            </h1>
            <p className="mb-5 sm:text-2xl sm:font-[600]  sm:text-gray-400 text-[18px]  text-gray-400 ">
              Please log in to view movie tracker.
            </p>
            
            <div className=" flex flex-col gap-3 p-5 w-full  ">
                <Link to="/login" className=" bg-[#973C00] border outline-none rounded-2xl p-2 text-[17px] font-medium ">Login</Link>
                <Link to="/register" className=" bg-[#973C00] border outline-none rounded-2xl p-2 text-[17px] font-medium " >Register</Link>
            </div>  
            
            
          </div>
        )}
      </div>
    </div>
  );
}

export default Home
