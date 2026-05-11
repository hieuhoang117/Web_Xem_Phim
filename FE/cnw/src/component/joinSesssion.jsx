import { useNavigate  } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const JoinSession = () => {
    const [sessionCode, setSessionCode] = useState("");
    const navigate = useNavigate();


    const handleJoinByCode = async () => {
        if (!sessionCode.trim()) {
            alert("Vui lòng nhập mã session!");
            return;
        }
        const code=sessionCode.trim();

        try {
            // Kiểm tra session có tồn tại và còn live không
            const { data } = await axios.get(
                `http://localhost:5000/api/coment/session/live/${code}`
            );

            if (!data.isLive) {
                alert("❌ Session không tồn tại hoặc đã kết thúc!");
                return;
            }
            

            // Lấy thông tin session để navigate
            const { data: sessionData } = await axios.get(
                `http://localhost:5000/api/coment/session/detail/${code}`
            );

            navigate(`/user/watch_together/play/${sessionData.IDmovie}/${code}`);

        } catch (err) {
            console.error("Error joining session:", err);
            alert("❌ Mã session không hợp lệ!");
        }
        
    };
    return (
        <div className="join-by-code">
            <div className="join-input-group">
                <input
                    type="text"
                    placeholder="Nhập mã session..."
                    value={sessionCode}
                    onChange={(e) => setSessionCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoinByCode()}
                />
                <button onClick={handleJoinByCode}>Tham gia</button>
            </div>
        </div>
    )
};

export default JoinSession;