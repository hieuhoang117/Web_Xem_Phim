import MovieSlide from "./US_slide";
import { useState, useEffect } from "react";
import MovieRow from "./Movierow";
import MovieTop from "./Movie_Top.jsx";
import "./Menu_main.css";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";


const Menu_movie = () => {
  const [movies, setMovies] = useState([]);
  const [horror, setHorror] = useState([]);
  const [romance, setRomance] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [topSeries, setTopSeries] = useState([]);
  const[drama,setDrama]=useState([]);
  const[adventure,setAdventure]=useState([]);
  const[fantasy,setFantasy]=useState([]);
  const[thriller,setThriller]=useState([]);
  const[western,setWestern]=useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const category = ["Action",
          "Adventure",
          "Comedy",
          "Drama",
          "Sci-fi",
          "Fantasy",
          "Horror",
          "Romance",
          "Thriller",
          "Western"];

        const promises = category.map(async (cat) => {
          const res = await fetch(`http://localhost:5000/api/movies/category/${cat}`);
          const data = await res.json();
          return { category: cat, data };
        });

        const results = await Promise.all(promises);

        results.forEach(({ category, data }) => {
          switch (category) {
            case "Action":
              setMovies(data.movies || []);
              break;
            case "Comedy":
              setComedy(data.movies || []);
              break;
            case "Drama":
              setDrama(data.movies || []);
              break;
            case "Adventure":
              setAdventure(data.movies || []);
              break;
            case "Fantasy":
              setFantasy(data.movies || []);
              break;
            case "Thriller":
              setThriller(data.movies || []);
              break;
            case "Western":
              setWestern(data.movies || []);
              break;
            case "Horror":
              setHorror(data.movies || []);
              break;
            case "Romance":
              setRomance(data.movies || []);
              break;
            case "Sci-fi":
              setScifi(data.movies || []);
              break;

            default:
              console.warn("Unknown category:", category);
              break;
          }
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  const fetchTopMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movies/top");
      const data = await res.json();
      setTopSeries(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTopMovies();
  }, []);
  const categories = [
    { key: "Action", label: "Hành động" },
    { key: "Romance", label: "Lãng mạn" },
    { key: "Horror", label: "Kinh dị" },
    { key: "Sci-fi", label: "Khoa học viễn tưởng" },
    { key: "Comedy", label: "Hài hước" },
    { key: "Drama", label: "Drama" },
    { key: "Adventure", label: "Phiêu lưu" },
    { key: "Fantasy", label: "Huyền bí" },
    { key: "Thriller", label: "Giật gân" },
    { key: "Western", label: "Western" },
  ];
  
  const menuProps = {
    items: categories,
    onClick: (e) => {
      const category = e.key;
      navigate(`/user/movie_genre/${category}`);
    },
  };

  return (
    <div className="menu-main">
      <MovieSlide movies={topSeries} />
      <Dropdown menu={menuProps} trigger={["click"]}>
        <div className="category-btn">
          Danh mục
          <span className="arrow">▼</span>
        </div>
      </Dropdown>

      {movies.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Nếu bạn thích phim cảm giác mạnh" movies={movies} />
      )}
      {horror.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Sự rùng rợn" movies={horror} />
      )}
      {scifi.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Khoa học viễn tưởng" movies={scifi} />
      )}

      {comedy.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải..</p>
      ) : (
        <MovieRow title="Hài hước" movies={comedy} />
      )}

      {romance.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Lãng mạn" movies={romance} />
      )}
      {drama.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Drama" movies={drama} />
      )}
      {adventure.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Phiêu lưu" movies={adventure} />
      )}
      {fantasy.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Huyền bí" movies={fantasy} />
      )}
      {thriller.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Giật gân" movies={thriller} />
      )}
      {western.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Western" movies={western} />
      )}
      {topSeries.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <div className="top10-row">
          <h2>Top phim xem nhiều nhất</h2>

          <div className="top10-list">
            {topSeries.slice(0, 10).map((movie, index) => (
              <MovieTop
                key={movie.IDmovie}
                movie={movie}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Menu_movie;