import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import userStore from "../store/useUserStore.js";
import Report from"./Report_bug.jsx";
import "./MoviePlay.css";

const MoviePlay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const userID = userStore((state) => state.userId);

    useEffect(() => {
        fetch(`http://localhost:5000/api/movies/id/${id}`)
            .then(res => res.json())
            .then(data => setMovie(data.movie || data[0] || data));
    }, [id]);

    if (!movie) return (
        <div className="mp-loading">Đang tải...</div>
    );

    return (
        <div className="mp-player">
            <button className="mp-back" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>
            
            <video
                src={movie.Film}
                autoPlay
                controls
                className="mp-video"
            />
            <Report ContentID={movie.ContentID} UserID={userID} />
        </div>
    );
};

export default MoviePlay;