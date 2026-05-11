import "./US_WatchTogether.css";
import USWatchIterm from "./US_WatchTogetherIterm";
import { useEffect, useState } from "react";
import axios from "axios";
import userStore from "../store/useUserStore";
import USWatchIterm2 from "./US_WatchTogetherIterm2";

const US_WatchTogether = () => {
    const [contents, setContents] = useState([]);
    const [isopen, setIsopen] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [othersSession, setOthersSession] = useState([]);
    const [otherMovies, setOtherMovies] = useState([]);

    const userId = userStore((state) => state.userId);
    const formatDate = (date) => date.replace("T", " ") + ":00";

    const [form, setForm] = useState({
        contentId: "",
        StartTime: "",
        EndTime: ""
    });

    // 🔹 Lấy phim bang id
    const fetchMovieById = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/movies/content/${id}`);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Error fetching movie:", err);
        }
    };
     const fetchOthersSessions = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/coment/session/random/${userId}`);
            const data = await res.json();
            console.log("sessions data:", data);
            setOthersSession(data);


            if (data.length > 0) {
                const movieList = await Promise.all(
                    data.map(async (otherSession) => {
                        const movie = await fetchMovieById(otherSession.ContentID);
                        return {
                            ...movie,
                            SessionID: otherSession.SessionID,
                            StartTime: otherSession.StartTime,
                            EndTime: otherSession.EndTime
                        };
                    })
                );
                setOtherMovies(movieList);
            } else {
                setOtherMovies([]);
            }

        } catch (err) {
            console.error("Error fetching sessions:", err);
        }
    };

    // 🔹 Lấy danh sách session đang live
    const fetchSessions = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/coment/session/${userId}`);
            const data = await res.json();
            console.log("sessions data:", data);
            setSessions(data);


            if (data.length > 0) {
                const movieList = await Promise.all(
                    data.map(async (session) => {
                        const movie = await fetchMovieById(session.ContentID);
                        return {
                            ...movie,
                            SessionID: session.SessionID,
                            StartTime: session.StartTime,
                            EndTime: session.EndTime
                        };
                    })
                );
                setMovies(movieList);
            } else {
                setMovies([]);
            }

        } catch (err) {
            console.error("Error fetching sessions:", err);
        }
    };

    // 🔹 Lấy danh sách phim
    const fetchContent = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/notifix/content");
            const data = await res.json();
            setContents(data);
        } catch (err) {
            console.error("Error fetching content:", err);
        }
    };

    useEffect(() => {
        fetchContent();
        fetchSessions();
        fetchOthersSessions();

        const interval = setInterval(() => {
            fetchSessions();
        }, 10000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // 🔥 TẠO SESSION MỚI
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/coment/session",
                {
                    contentId: form.contentId,
                    UserID: userId,
                    StartTime: formatDate(form.StartTime),
                    EndTime: formatDate(form.EndTime)
                }
            );

            console.log("✅ Session created:", res.data.sessionId);

            // Reset form
            setForm({ contentId: "" });
            setIsopen(false);

            // Reload danh sách session
            await fetchSessions();

            alert("✅ Tạo buổi công chiếu thành công!");

        } catch (err) {
            console.error("❌ Error creating session:", err);
            alert("❌ Không thể tạo buổi công chiếu. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 KẾT THÚC SESSION
    const handleEndSession = async (sessionId) => {
        if (!window.confirm("Bạn có chắc muốn kết thúc buổi công chiếu này?")) {
            return;
        }

        try {
            await axios.post("http://localhost:5000/api/coment/session/end", {
                sessionId: sessionId,
            });

            alert("✅ Đã kết thúc buổi công chiếu!");
            fetchSessions();

        } catch (err) {
            console.error("Error ending session:", err);
            alert("❌ Không thể kết thúc buổi công chiếu!");
        }
    };

    return (
        <div className="US_WatchTogether">
            <div className="header-section">
                <h2>🎬 Các buổi công chiếu </h2>
                <button
                    className="btn-open"
                    onClick={() => setIsopen(true)}
                >
                    + Tạo công chiếu mới
                </button>
            </div>

            {/* 🔥 FORM TẠO SESSION */}
            {isopen && (
                <div className="watch-form-wrapper" onClick={() => setIsopen(false)}>
                    <form
                        className="watch-form"
                        onSubmit={handleSubmit}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="form-header">
                            <h3>Tạo buổi công chiếu</h3>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setIsopen(false)}
                            >
                                ✖
                            </button>
                        </div>

                        <div className="form-body">
                            <label>Chọn phim:</label>
                            <select
                                name="contentId"
                                value={form.contentId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Chọn phim --</option>
                                {contents.map((c) => (
                                    <option key={c.ContentID} value={c.ContentID}>
                                        {c.ContentName}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="StartTime"
                                type="datetime-local"
                                onChange={handleChange}
                            />

                            <input
                                name="EndTime"
                                type="datetime-local"
                                onChange={handleChange}
                            />

                            <button type="submit" disabled={loading}>
                                {loading ? "Đang tạo..." : "Tạo buổi công chiếu"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {othersSession.length === 0 ? (
                <div className="no-sessions">
                    <p>Chưa có buổi công chiếu nào đang diễn ra</p>
                </div>
            ) : (
                <USWatchIterm2
                    movies={otherMovies}
                />
            )}
            <h2 className="live-sessions-title" style={{color: "white"}}>Buổi công chiếu của bạn đang diễn ra:</h2>

            {sessions.length === 0 ? (
                <div className="no-sessions">
                    <p>Bạn chưa có buổi công chiếu nào đang diễn ra</p>
                </div>
            ) : (
                <USWatchIterm
                    movies={movies}
                    onEndSession={handleEndSession}
                />
            )}
        </div>
    );
};

export default US_WatchTogether;