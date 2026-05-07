import Coment from "./Coment.jsx";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import userStore from "../store/useUserStore";
import "./US_WatchTogetherPlay.css";

const US_WatchTogetherPlay = () => {
    const { id, SessionID } = useParams();
    const [movie, setMovie] = useState(null);
    const [session, setSession] = useState(null);
    const [ended, setEnded] = useState(false);
    const [notStarted, setNotStarted] = useState(false);
    const userId = userStore((state) => state.userId);
    const videoRef = useRef(null);

    const fetchSession = async (SessionID) => {
        try {
            const res = await fetch(`http://localhost:5000/api/coment/session/id/${SessionID}`);
            const data = await res.json();
            setSession(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMovies = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/movies/id/${id}`);
            const data = await res.json();
            setMovie(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchSession(SessionID);
        fetchMovies(id);
    }, [id, SessionID]);


    useEffect(() => {
        if (!movie || !session || !videoRef.current) return;

        const video = videoRef.current;

        // ✅ Bù múi giờ +7
        const OFFSET = 7 * 60 * 60 * 1000;
        const startTime = new Date(session.StartTime).getTime() - OFFSET;
        const endTime = new Date(session.EndTime).getTime() - OFFSET;
        const now = Date.now();


        // ✅ Check ended TRƯỚC
        if (now > endTime) {
            setEnded(true);
            return;
        }

        // ✅ Check chưa bắt đầu SAU
        if (now < startTime) {
            setNotStarted(true);
            return;
        }

        const setCorrectTime = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const dur = video.duration;
            if (!dur) return;
            video.currentTime = elapsed % dur;
            video.muted = true;

            video.play().then(() => {
                // ✅ Chờ 500ms rồi mới unmute
                setTimeout(() => {
                    video.muted = false;
                }, 500);
            }).catch(err => {
                console.log("Play error:", err);
            });
        };

        if (video.readyState >= 1) {
            setCorrectTime();
        } else {
            video.addEventListener("loadedmetadata", setCorrectTime, { once: true });
        }

        const handleSeeking = () => {
            // ✅ Thêm flag để tránh loop seeking
            if (video._isSeeking) return;
            video._isSeeking = true;

            const elapsed = (Date.now() - startTime) / 1000;
            const dur = video.duration;
            if (dur) {
                video.currentTime = elapsed % dur;
            }

            setTimeout(() => {
                video._isSeeking = false;
            }, 300);
        };

        const handleEnded = () => {
            if (Date.now() < endTime) {
                video.currentTime = 0;
                video.muted = true;
                video.play().then(() => {
                    video.muted = false;
                }).catch(err => console.log(err));
            } else {
                setEnded(true);
            }
        };

        const checkEnd = setInterval(() => {
            if (Date.now() > endTime) {
                setEnded(true);
                clearInterval(checkEnd);
            }
        }, 5000);

        video.addEventListener("seeking", handleSeeking);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("seeking", handleSeeking);
            video.removeEventListener("ended", handleEnded);
            clearInterval(checkEnd);
        };
    }, [movie, session]);

    if (!movie || !session) return <div>Đang tải...</div>;


    return (
        <div className="play-watch-title" >
            <div>
                <h1>{movie.NameMovie}</h1>

                {notStarted && <div>⏳ Buổi chiếu chưa bắt đầu</div>}
                {ended && <div>⏹ Buổi chiếu đã kết thúc</div>}

                {!notStarted && !ended && (
                    <video
                        ref={videoRef}
                        src={movie.Film}
                        controls
                        style={{ width: "100%" }}
                    />
                )}
            </div>
            <div className="coment-box-play">
                <Coment contentId={movie.ContentID} sessionId={SessionID} user={userId} />
            </div>


        </div>
    );
};

export default US_WatchTogetherPlay;