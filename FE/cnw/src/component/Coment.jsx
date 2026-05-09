import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Coment.css";

const CommentBox = ({ contentId, sessionId, user }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [lastTime, setLastTime] = useState(null);
    const listRef = useRef();


    // 🔹 load ban đầu
    useEffect(() => {
        const fetchComments = async () => {
            const res = await axios.get("http://localhost:5000/api/coment", {
                params: { contentId, sessionId }
            });

            const data = res.data.reverse();
            setComments(data);

            if (data.length > 0) {
                setLastTime(data[data.length - 1].CreatedAt);
            }
        };

        fetchComments();
    }, [contentId, sessionId]);

    // 🔹 polling realtime (mỗi 2s)
    useEffect(() => {
        console.log("sessionId", sessionId);

        if (!sessionId) return;

        const interval = setInterval(async () => {
            try {
                if (!lastTime) return;

                const res = await axios.get(`http://localhost:5000/api/coment/new/${sessionId}/${lastTime}`);

                if (Array.isArray(res.data) && res.data.length > 0) {
                    setComments(prev => [...prev, ...res.data]);
                    setLastTime(res.data[res.data.length - 1].CreatedAt);
                }
            } catch (err) {
                console.log(err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [sessionId, lastTime]);

    // 🔹 gửi comment
    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            await axios.post("http://localhost:5000/api/coment/", {
                contentId,
                userId: user,
                commentText: text,
                sessionId
            });

            setText("");
        } catch (err) {
            console.log(err.response?.data); // debug
        }
    };

    // 🔹 auto scroll
    useEffect(() => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [comments.length]);

    return (
        <div className="comment-box">
            <div className="comment-list" ref={listRef}> {/* ← gắn ref vào đây */}
                {comments.map((c) => (
                    <div key={c.CommentID} className="comment-item">
                        <b>{c.FullName}</b>: {c.CommentText}
                    </div>
                ))}
                {/* Bỏ <div ref={bottomRef}> */}
            </div>

            <div className="comment-input">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập bình luận..."
                />
                <button onClick={handleSend}>Gửi</button>
            </div>
        </div>
    );
};

export default CommentBox;