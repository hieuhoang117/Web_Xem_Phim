import "./banner.css";
import { useState } from "react";
import Header from "./header1";
import { useNavigate } from "react-router-dom";
import userStore from "../store/useUserStore";

const Banner = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = userStore((state) => state.login);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ!");
      return;
    }

    const res = await fetch("http://localhost:5000/api/users/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.exists) {
      alert("❌ Sai email hoặc mật khẩu");
      return;
    }

    login(data.userId, data.token, data.role);

    if (data.role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/user/menu_main");
    }
  };

  return (
    <div className="bn-banner">
      <Header />

      <div className="bn-content">
        <h1>Phim, series không giới hạn</h1>
        <p>Giá từ 74.000đ</p>
        <p>
          Bạn đã sẵn sàng xem chưa? Nhập email để tạo hoặc kích hoạt lại tư cách thành viên của bạn.
        </p>

        <div className="bn-form">
          <input
            className="bn-input"
            placeholder="Địa chỉ email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="bn-input"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="bn-btn-start" onClick={handleClick}>
            Bắt đầu &gt;
          </button>
          
          <span className="bn-forgot" onClick={() => navigate("/Forgot")}>
            Quên mật khẩu
          </span>
        </div>
      </div>
    </div>
  );
};

export default Banner;