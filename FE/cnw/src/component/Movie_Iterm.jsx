import { useState } from "react";
import "./Movie_Iterm.css";
import { useNavigate } from "react-router-dom";

const MovieItem = ({ movie }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();


  const isSeries = !!movie.IDseries;

  return (
    <div
      className={`movie-item ${hovered ? "active" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={movie.MoviePoster||movie.Poster || movie.SeriesPoster || movie.poster}
        alt={movie.NameMovie || movie.SeriesName}
      />

      {hovered && (
        <div className="movie-card-iterm">
          <h4>{movie.NameMovie || movie.SeriesName||movie.Title}</h4>

          <p>
            {movie.movieDescription ||
              movie.seriesDescription ||
              movie.Description ||
              "Không có mô tả"}
          </p>

          <div className="actions">
           
            <button
              onClick={() =>
                isSeries
                  ? navigate(`/user/series/${movie.IDseries}`)
                  : navigate(`/user/movie/${movie.IDmovie}/play`)
              }
            >
              ▶
            </button>

            
            <button
              onClick={() =>
                isSeries
                  ? navigate(`/user/series/${movie.IDseries}`)
                  : navigate(`/user/movie/${movie.IDmovie}`)
              }
            >
              ℹ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieItem;