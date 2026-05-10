import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieItem from "./Movie_Iterm";
import "./Movie_genre.css";

const Series_genre = () => {
    const { Category } = useParams();
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/movies/category/${Category}`);
                const data = await res.json();
                setSeries(data.series || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSeries();
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
                {series.map((serie) => (
                    <div className="movie-card-wrapper" key={serie.IDserie}>
                        <MovieItem movie={serie} />
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Series_genre;