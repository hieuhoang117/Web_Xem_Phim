import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import EpisodeItem from "./EpisodeItem";
import userStore from "../store/useUserStore.js";
import Report from "./Report_bug.jsx";
import "./EpisodePlay.css";

const EpisodePlay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const activeRef = useRef();
    const userID = userStore((state) => state.userId);

    const [episode, setEpisode] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [showList, setShowList] = useState(false);
    const [solandoi, setSolandoi] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res1 = await fetch(`http://localhost:5000/api/series/episodes/${id}`);
                const data = await res1.json();
                setEpisode(data);

                const res2 = await fetch(`http://localhost:5000/api/series/episodes/series/${data.IDseries}`);
                const list = await res2.json();

                if (Array.isArray(list)) {
                    setEpisodes(list.sort((a, b) => a.EpisodeNumber - b.EpisodeNumber));
                } else {
                    setEpisodes([]);
                }
            } catch (err) {
                console.error("FETCH ERROR:", err);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (showList && activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [showList]);

    if (!episode) return <div style={{ color: "white", padding: 20 }}>Loading...</div>;

    return (
        <div className="netflix-player">
            <div className="report-container-episode">
                <Report ContentID={episode.ContentID} UserID={userID} />
            </div>


            <iframe
                key={episode.IDEpisode}
                src={episode.film}
                className="netflix-video"
                allowFullScreen
            />

            <button className="mp-back" onClick={() => navigate(-solandoi)}>
                ← Quay lại
            </button>

            <button className="nf-list-btn" onClick={() => setShowList(!showList)}>
                ☰
            </button>

            {showList && (
                <div className="nf-backdrop" onClick={() => setShowList(false)} />
            )}

            <div className={`nf-sidebar ${showList ? "show" : ""}`}>
                <div className="nf-header">
                    <button className="nf-back-list" onClick={() => setShowList(false)}>←</button>
                    <span>Mùa {episode.SeasonNumber || 1}</span>
                </div>

                {episodes.map((ep) => {
                    const isActive = String(ep.IDEpisode) === String(id);
                    return (
                        <div
                            key={ep.IDEpisode}
                            ref={isActive ? activeRef : null}
                            className={`episode-wrapper ${isActive ? "active-episode" : ""}`}
                        >
                            <EpisodeItem
                                ep={ep}
                                onClick={() => {
                                    navigate(`/user/watch/${ep.IDEpisode}`);
                                    setShowList(false);
                                    setSolandoi(prev => prev + 1);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EpisodePlay;