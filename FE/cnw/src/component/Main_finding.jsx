import { useState, useEffect } from "react";
import "./Main_finding.css";
import MovieItem from "./Movie_Iterm";
import ActorItem from "./actorIterm";
import { useParams } from "react-router-dom";

const Main_finding = () => {
    const [movie, setmovie] = useState([]);
    const { searchInput } = useParams();
    const [actors, setActors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/movies/search/${searchInput}`);
                const data = await res.json();
                setmovie(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (searchInput) {
            fetchData();
        }
    }, [searchInput]);
    useEffect(() => {
        const handleFindActor = async (name) => {
            try {
                const res = await fetch(`http://localhost:5000/api/actor/name/${name}`);
                const data = await res.json();
                setActors(data);
            } catch (err) {
                console.error(err);
            }
        };

        if (searchInput) {
            handleFindActor(searchInput);
        }

    } , [searchInput]);

    return (
        <div className="main-finding">
            <h1 className="finding-title">Kết quả tìm kiếm theo: "{searchInput}"</h1>
            
            <div className="movie-list_genre">
                <h2 className="finding-title">Danh sách diễn viên</h2>
                {actors.map((actor) => (
                    <div className="actor-card-wrapper" key={actor.IDactor}>
                        <ActorItem actor={actor} />
                    </div>
                ))}
            </div>
            
            <div className="movie-list_genre">
                <h2 className="finding-title">Danh sách phim</h2>
                {movie.map((watchedItem) => (
                    <div className="movie-card-wrapper" key={watchedItem.IDmovie}>
                        <MovieItem movie={watchedItem} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main_finding;