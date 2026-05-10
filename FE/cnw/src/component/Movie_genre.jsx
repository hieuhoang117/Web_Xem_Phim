import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieItem from "./Movie_Iterm";
import "./Movie_genre.css";

const Movie_genre = () => {
    const { Category } = useParams();
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/movies/category/${Category}`);
                const data = await res.json();
                setMovies(data.movies || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMovies();
    }, [Category]);
    const categoryMap = {
        "Action": "Hành động",
        "Comedy": "Hài hước",
        "Horror": "Kinh dị",
        "Romance": "Lãng mạn",
        "Sci-fi": "Khoa học viễn tưởng",
        "Drama": "Drama",
        "Adventure": "Phiêu lưu",
        "Fantasy": "Huyền bí",
        "Thriller": "Giật gân",
        "Western": "Western",
    };

    return (
        <div className="movie-genre">
            <h1 className="genre-title">
                Phim <span>{categoryMap[Category] || Category}</span>
            </h1>

            <div className="movie-list_genre">
                {movies.map((movie) => (
                    <div className="movie-card-wrapper" key={movie.IDmovie}>
                        <MovieItem movie={movie} />
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Movie_genre;