import logo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Input, Badge, Dropdown, Avatar, Space } from "antd";
import { UserOutlined, BellOutlined } from "@ant-design/icons";
import NotificationItem from "./NotificationIterm";
import { useEffect, useState } from "react";
import "./US_header.css";
import userStore from "../store/useUserStore";


const USHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [notifix, setNotifix] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const userId = userStore((state) => state.userId);
    const [userInfo, setUserInfo] = useState(null);
    
    const logoutAction = userStore((state) => state.logout);

    const logout = () => {
        logoutAction();
        navigate("/");
    };

    const handleSearch = () => {
        if (search.trim()) {
            navigate(`/user/finding/${search}`);
        }
    };
    const fetchNotifix = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/notifix/active");
            const data = await res.json();
            setNotifix(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!userId) return;

                const res = await fetch(`http://localhost:5000/api/users/id/${userId}`);
                const data = await res.json();
                setUserInfo(data);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchNotifix();
        fetchUser();
    }, [userId]);

    const handleClickNoti = async (n) => {
        try {
            const res = await fetch(`http://localhost:5000/api/notifix/content/${n.ContentID}`);
            const data = await res.json();

            if (data.ContentType === "Movie") {
                navigate(`/user/movie/${data.IDmovie}`);
            } else if (data.ContentType === "Series") {
                navigate(`/user/series/${data.IDseries}`);
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const items = [
        {
            key: "1",
            label: <span>{userInfo?.FullName || "User"}</span>,
        },
        {
            key: "2",
            label: <span onClick={() => navigate("/info/info")}>Trang cá nhân</span>,
        },
        {
            key: "2",
            label: <span onClick={() => logout()}>Đăng xuất</span>,
        },
    ];

    return (
        <div className={`header_user ${isScrolled ? "scrolled" : ""}`}>
            <img src={logo} alt="logo" className="logo"
                onClick={() => navigate("/user/menu_main")}
                style={{ cursor: "pointer" }} />
            <div className="menu">
                <Link to="/user/menu_main" className="Link">Trang chủ</Link>
                <Link to="/user/menu_series" className="Link">Series</Link>
                <Link to="/user/menu_movie" className="Link">Phim</Link>
                <Link to="/user/new_and_hot" className="Link">Mới và phổ biến</Link>
                <Link to="/user/watched" className="Link">Danh sách của tôi</Link>
                <Link to="/user/watch_together" className="Link">Xem chung</Link>
            </div>
            <div className="account">
                <Space size="middle">

                    <Input
                        placeholder="Tìm kiếm diễn viên, phim, series,..."
                        style={{ width: 200 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onPressEnter={handleSearch}
                    />

                    <Badge count={notifix.length} offset={[0, 10]}>
                        <Dropdown
                            dropdownRender={() => (
                                <div className="notification-dropdown">
                                    {notifix.length === 0 ? (
                                        <p style={{ padding: 20 }}>Không có thông báo nào</p>
                                    ) : (
                                        notifix.map((n) => (
                                            <NotificationItem
                                                key={n.NotificationID}
                                                notification={n}
                                                onClick={() => handleClickNoti(n)}
                                            />
                                        ))
                                    )}
                                </div>
                            )}
                            trigger={["click"]}
                        >
                            <button className="notification-button" style={{ background: "none", border: "none", padding: 0, color: "white" }}>
                                <BellOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                            </button>
                        </Dropdown>
                    </Badge>

                    <Dropdown menu={{ items }}>
                        <Avatar
                            icon={<UserOutlined />}
                            style={{ cursor: "pointer" }}
                        />
                    </Dropdown>

                </Space>
            </div>


        </div>
    );
};

export default USHeader;