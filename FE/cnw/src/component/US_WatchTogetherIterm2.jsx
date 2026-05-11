import React from "react";
import { useNavigate } from "react-router-dom";

const USWatchIterm2 = ({ movies}) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return "Không có";

        const date = new Date(dateString);
        if (isNaN(date)) return "Không có";

        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"  
        });
    };


    return (
        <div className="watch-items-container">
            {movies.map((movie) => (
                <div key={movie.SessionID} className="watch-item">
                    <div className="movie-poster">
                        <img
                            src={movie.Poster || "/placeholder.jpg"}
                            alt={movie.NameMovie}
                        />
                        <div className="live-badge">🔴 LIVE</div>
                    </div>

                    <div className="movie-info">
                        <h3>{movie.NameMovie}</h3>
                        <p className="session-id">Session: {movie.SessionID}</p>
                        <p className="start-time">⏰ Bắt đầu: {formatDate(movie.StartTime)}</p>
                        <p className="start-time">🔚 Kết thúc: {formatDate(movie.EndTime)}</p>
                    </div>

                    <div className="movie-actions">
                        <button
                            className="btn-join"
                            onClick={() => navigate(`/user/watch_together/play/${movie.IDmovie}/${movie.SessionID}`)}
                        >
                            Tham gia xem
                        </button>
                        
                    </div>
                </div>
            ))}
        </div>
    );
};

export default USWatchIterm2;