import { Typography } from "antd";

const { Text } = Typography;

const NotificationItem = ({ notification, onClick }) => {
    return (
        <div
            onClick={() => onClick(notification)}
            style={{
                display: "flex",
                gap: "10px",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #333",
                backgroundColor: "#222",
                borderRadius: 4,
                marginBottom: 8,
                alignItems: "center"
            }}
        >
            <img
                src={notification.ImageURL || "https://via.placeholder.com/80"}
                alt={notification.Title}
                style={{
                    width: 80,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: 4
                }}
            />

            <div style={{ flex: 1 }}>
                <Text strong style={{ color: "white", display: "block" }}>
                    {notification.Title}
                </Text>

                <Text style={{ color: "#aaa", fontSize: 12 }}>
                    {notification.Message}
                </Text>
            </div>
        </div>
    );
};

export default NotificationItem;