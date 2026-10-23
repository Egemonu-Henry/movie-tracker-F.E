const IMG_BASE = "https://image.tmdb.org/t/p/w300";


const movieCard = ({
  movie,
  actionLabel,
  onAction,
  isWatchlist,
  onToggleWatched,
  onRemove,
    }) => {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const posterUrl = movie.poster_path
    ? `${IMG_BASE}${movie.poster_path}`
    : null;

  const btn =
    "rounded-md px-3 py-1.5 text-[0.8rem] font-medium transition-all duration-200";

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[10px] border border-[#973C00] border-border bg-surface transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] ${
        movie.watched ? "opacity-65" : ""
      }`}
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-surface-hover">
        {posterUrl ? (
          <img
            className="h-full w-full object-cover"
            src={posterUrl}
            alt={`${movie.title} poster`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.9rem] text-muted">
            No Poster
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h3 className="text-base font-semibold leading-snug text-text">
          {movie.title}
        </h3>
        <div className="flex gap-3 text-[0.85rem] text-muted">
          <span>{year}</span>
          {movie.vote_average > 0 && (
            <span className="text-warning">
              {movie.vote_average.toFixed(1)} / 10
            </span>
          )}
        </div>

        {movie.overview && (
          <p className="text-[0.8rem] leading-[1.4] text-muted">
            {movie.overview.length > 120
              ? movie.overview.slice(0, 120) + "..."
              : movie.overview}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {/* Search result card -- show "Add to Watchlist" button */}
          {onAction && (
            <button
              className={`${btn} flex-1 bg-accent text-white hover:bg-accent-hover`}
              onClick={onAction}
            >
              {actionLabel}
            </button>
          )}

          {/* Watchlist card -- show toggle + remove buttons */}
          {isWatchlist && (
            <>
              <button
                className={`${btn} flex-1 border border-border bg-surface-hover text-text hover:border-accent hover:text-accent`}
                onClick={onToggleWatched}
              >
                {movie.watched ? "Mark Unwatched" : "Mark Watched"}
              </button>
              <button
                className={`${btn} border border-danger bg-transparent text-danger hover:bg-danger hover:text-white`}
                onClick={onRemove}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default movieCard

