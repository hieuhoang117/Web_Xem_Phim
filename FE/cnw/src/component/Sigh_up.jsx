import "./Sigh_up.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: form info, 2: OTP

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handlecheckEmail = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users/check-email-new", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            return data.exists;
        } catch (err) {
            console.error(err);
            return true;
        }
    };
    const handleNext = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        const exists = await handlecheckEmail();
        if (exists) {
            setError("Email đã tồn tại");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/users/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStep(2);
            } else {
                setError("Không gửi được OTP");
            }
        } catch {
            setError("Lỗi server");
        }
    };


    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/users/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            if (!res.ok) {
                setError("OTP không đúng hoặc hết hạn");
                return;
            }

        
            const register = await fetch("http://localhost:5000/api/users/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    FullName: fullName,
                    Email: email,
                    PasswordHash: password
                })
            });

            if (register.ok) {
                alert("Đăng ký thành công");
                navigate("/");
            } else {
                setError("Đăng ký thất bại");
            }

        } catch {
            setError("Lỗi server");
        }
    };

    return (
        <div className="signupbody">
            <div className="signup-container">

                <button onClick={() => navigate(-1)}>
                    ← Quay lại
                </button>

                <h2>{step === 1 ? "Đăng Ký" : "Nhập OTP"}</h2>

                {/* STEP 1: FORM NHẬP THÔNG TIN */}
                {step === 1 && (
                    <form onSubmit={handleNext} className="signup-form">

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            placeholder="Họ và tên"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && <p className="error">{error}</p>}

                        <button type="submit">Tiếp tục</button>
                    </form>
                )}

                {/* STEP 2: FORM OTP */}
                {step === 2 && (
                    <form onSubmit={handleVerify} className="signup-form">

                        <input
                            type="text"
                            placeholder="Nhập OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />

                        {error && <p className="error">{error}</p>}

                        <button type="submit">Xác nhận & Đăng ký</button>
                        <button
                            type="button"
                            onClick={() => handleNext(new Event("submit"))}
                            style={{ marginTop: "10px", background: "#333" }}
                        >
                            Gửi lại OTP
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{ marginTop: "10px", background: "#333" }}
                        >
                            Quay lại
                        </button>

                    </form>
                )}

            </div>
        </div>
    );
};

export default SignUp;