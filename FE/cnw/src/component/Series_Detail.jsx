import "./Series_Detail.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EpisodeItem from "./EpisodeItem";
import userStore from "../store/useUserStore";
import ToActor from "./ToActor";

const SeriesDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [series, setSeries] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const userId = userStore((state) => state.userId);
    const [iswatchlist, setIsWatchlist] = useState(false);

    const addwatch = async (episodeId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/series/views`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    episodeId: episodeId
                })
            });

            if (!res.ok) {
                console.error("Lỗi khi thêm lịch sử xem");
            }

        } catch (err) {
            console.error(err);
        }
    };
    const deletewatch = async (episodeId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/series/views/${userId}/${episodeId}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                console.error("Lỗi khi xóa lịch sử xem");
            }
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetch(`http://localhost:5000/api/series/series/${id}`)
            .then(res => res.json())
            .then(data => {
                setSeries(data.series);
                setEpisodes(data.episodes || []);
            })
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        if (!episodes.length) return;

        const checkWatchlist = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/series/views/${userId}/${episodes[0].IDEpisode}`
                );
                const data = await res.json();
                setIsWatchlist(data.isAdded);
            } catch (err) {
                console.error(err);
            }
        };

        checkWatchlist();
    }, [episodes, userId]);

    const toggleWatchlist = async () => {
        if (!episodes[0]?.IDEpisode) return;

        if (iswatchlist) {
            await deletewatch(episodes[0].IDEpisode);
            setIsWatchlist(false);
        } else {
            await addwatch(episodes[0].IDEpisode);
            setIsWatchlist(true);
        }
    };


    if (!series) return <div style={{ color: "white" }}>Loading...</div>;

    return (
        <div className="modal-overlay" onClick={() => navigate(-1)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Banner */}
                <div
                    className="banner"
                    style={{
                        backgroundImage: `url(${series.poster})`
                    }}
                >
                    <div className="banner-content">
                        <h1>{series.SeriesName}</h1>

                        <div className="btn-group">
                            <button
                                className="play-btn"
                                onClick={() => {
                                    addwatch(episodes[0]?.IDEpisode);
                                    navigate(`/user/watch/${episodes[0]?.IDEpisode}`);
                                }}
                            >
                                ▶ Phát
                            </button>
                            <button className="watchlist-btn" onClick={toggleWatchlist}>
                                {iswatchlist ? "Xóa khỏi danh sách" : "Thêm vào danh sách"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="info">
                    <p>{series.Description}</p>

                    <div className="meta">
                        <span>{new Date(series.ReleaseYear).getFullYear()}</span>
                        <span>{series.Country}</span>
                        <span>{series.Status ? "Đang chiếu" : "Ngừng chiếu"}</span>
                    </div>
                    <p>Diễn viên:</p>
                    <ToActor seriesid={series.IDseries} />
                </div>

                {/* Episodes */}
                <div className="episodes">
                    <h2>Danh sách tập</h2>

                    {episodes.map((ep) => (
                        <EpisodeItem
                            key={ep.IDEpisode}
                            ep={ep}
                            onClick={() => {
                                addwatch(episodes[0].IDEpisode);
                                navigate(`/user/watch/${ep.IDEpisode}`);
                            }}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SeriesDetail;