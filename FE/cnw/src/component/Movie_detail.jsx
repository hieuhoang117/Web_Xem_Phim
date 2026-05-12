import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Movie_detail.css";
import userStore from "../store/useUserStore";
import ToActor from "./ToActor";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const userId = userStore((state) => state.userId);

  const addwatch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          movieId: id
        })
      });

      if (!res.ok) {
        console.error("Lỗi thêm view");
      }

    } catch (err) {
      console.error(err);
    }
  };
  const deletewatch = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/movies/views/${userId}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error("Lỗi xóa view");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/movies/id/${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data.movie || data[0] || data);
      });
  }, [id]);
  useEffect(() => {
      if (!movie) return;
    const checkWatchlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/movies/views/${userId}/${id}`);
        const data = await res.json();
        setIsWatchlist(data.isAdded);
      } catch (err) {
        console.error(err);
      }
    };
    checkWatchlist();
  }, [id, userId, movie]);
  if (!movie) return <div style={{ color: "white" }}>Loading...</div>;

  const toggleWatchlist = async () => {
    if (isWatchlist) {
      await deletewatch();
      setIsWatchlist(false);
    } else {
      await addwatch();
      setIsWatchlist(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => navigate(-1)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <div
          className="banner"
          style={{
            backgroundImage: `url(${movie.Backdrop || movie.Poster})`
          }}
        >
          <div className="banner-content">
            <h1>{movie.NameMovie}</h1>

            <div className="btn-group">
              <button className="play-btn" onClick={() => {
                addwatch();
                navigate(`/user/movie/${movie.IDmovie}/play`);
              }}>
                ▶ Phát
              </button>
              <button className="watchlist-btn" onClick={toggleWatchlist}>
                {isWatchlist ? "Xóa khỏi danh sách" : "Thêm vào danh sách"}
              </button>
            </div>
          </div>
        </div>

        <div className="info">
          <p>{movie.Description}</p>

          <div className="meta">
            <span>{movie.Year}</span>
            <span>{movie.Duration} phút</span>
            <span>{movie.Category}</span>
            <span>{movie.Country}</span>
            <span>{movie.Director}</span>
          </div>
        </div>
        <P>D</P>

        <ToActor movieid={movie.IDmovie} />

      </div>
    </div>
  );
};

export default MovieDetail;