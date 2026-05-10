import MovieSlide from "./US_slide";
import { useState, useEffect } from "react";
import MovieRow from "./Movierow";
import MovieTop from "./Movie_Top.jsx";
import "./Menu_main.css";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";


const Menu_series = () => {
  const [series, setSeries] = useState([]);
  const [serieshorror, setSeriesHorror] = useState([]);
  const [seriesromance, setSeriesRomance] = useState([]);
  const [seriesscifi, setSeriesScifi] = useState([]);
  const [seriescomedy, setSeriesComedy] = useState([]);
  const [topSeries, setTopSeries] = useState([]);
  const[seriesdrama,setSeriesDrama]=useState([]);
  const[seriesadventure,setSeriesAdventure]=useState([]);
  const[seriesfantasy,setSeriesFantasy]=useState([]);
  const[seriessThriller,setSeriesThriller]=useState([]);
  const[serieswestern,setSeriesWestern]=useState([]);
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
          "Western",];

        const promises = category.map(async (cat) => {
          const res = await fetch(`http://localhost:5000/api/movies/category/${cat}`);
          const data = await res.json();
          return { category: cat, data };
        });

        const results = await Promise.all(promises);

        results.forEach(({ category, data }) => {
          switch (category) {
            case "Action":
              setSeries(data.series || []);
              break;
            case "Comedy":
              setSeriesComedy(data.series || []);
              break;
            case "Horror":
              setSeriesHorror(data.series || []);
              break;
            case "Romance":
              setSeriesRomance(data.series || []);
              break;
            case "Sci-fi":
              setSeriesScifi(data.series || []);
              break;
            case "Drama":
              setSeriesDrama(data.series || []);
              break;
            case "Adventure":
              setSeriesAdventure(data.series || []);
              break;
            case "Fantasy":
              setSeriesFantasy(data.series || []);
              break;
            case "Thriller":
              setSeriesThriller(data.series || []);
              break;
            case "Western":
              setSeriesWestern(data.series || []);
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
  const fetchTopSeries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/series/top");
      const data = await res.json();
      setTopSeries(data || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchTopSeries();
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
      navigate(`/user/series_genre/${category}`);
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

      {series.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Nếu bạn thích series cảm giác mạnh" movies={series} />
      )}
      {serieshorror.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series rùng rợn" movies={serieshorror} />
      )}
      {seriesscifi.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series khoa học viễn tưởng" movies={seriesscifi} />
      )}
      {seriescomedy.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series hài hước" movies={seriescomedy} />
      )}
      {seriesromance.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series lãng mạn" movies={seriesromance} />
      )}
      {seriesdrama.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series drama" movies={seriesdrama} />
      )}
      {seriesadventure.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series phiêu lưu" movies={seriesadventure} />
      )}
      {seriesfantasy.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series huyền bí" movies={seriesfantasy} />
      )}
      {seriessThriller.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series giật gân" movies={seriessThriller} />
      )}
      {serieswestern.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <MovieRow title="Series western" movies={serieswestern} />
      )}
      {topSeries.length === 0 ? (
        <p style={{ color: "white", padding: 20 }}>Đang tải...</p>
      ) : (
        <div className="top10-row">
          <h2>Top series xem nhiều nhất</h2>

          <div className="top10-list">
            {topSeries.map((series, index) => (
              <MovieTop
                key={series.IDseries}
                movie={series}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Menu_series;