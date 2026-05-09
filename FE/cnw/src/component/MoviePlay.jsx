import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./MoviePlay.css";

const MoviePlay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);

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
        </div>
    );
};

export default MoviePlay;