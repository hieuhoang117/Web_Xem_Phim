import "./Actor_info.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieItem from "./Movie_Iterm";

const ActorInfo = () => {
    const { id } = useParams();
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [resActor, resMovies] = await Promise.all([
                    fetch(`http://localhost:5000/api/actor/id/${id}`),
                    fetch(`http://localhost:5000/api/actor/moviesbyactor/${id}`)
                ]);

                const actorData = await resActor.json();
                const moviesData = await resMovies.json();

                setActor(Array.isArray(actorData) ? actorData[0] : actorData);
                setMovies(Array.isArray(moviesData) ? moviesData : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false); 
            }
        };

        fetchAll();
    }, [id]);

    if (loading) return <div className="actor-loading">Đang tải...</div>;
    if (!actor) return <div className="actor-loading">Không tìm thấy diễn viên</div>;

    return (
        <div className="actor-info">
            <div className="actor-profile">
                <img
                    src={actor.Photo || "/default-actor.png"}
                    alt={actor.ActorName}
                    onError={(e) => e.target.src = "/default-actor.png"}
                />
                <div className="actor-details">
                    <h1>{actor.ActorName}</h1>
                    <div className="actor-meta">
                        <span>🎂 {actor.BirthDate ? actor.BirthDate.split("T")[0] : "Không rõ"}</span>
                        <span>🌍 {actor.Nationality || "Không rõ"}</span>
                    </div>
                    {actor.Descriptionn && (
                        <p className="actor-desc">{actor.Descriptionn}</p>
                    )}
                </div>
            </div>

            <div className="actor-movies">
                <h2>Phim đã tham gia</h2>
                {movies.length === 0 ? (
                    <p className="no-movies">Chưa có thông tin phim</p>
                ) : (
                    <div className="movie-grid">
                        {movies.map((m) => (
                            <MovieItem key={m.IDmovie} movie={m} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActorInfo;