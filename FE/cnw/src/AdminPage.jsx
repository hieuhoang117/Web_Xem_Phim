import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import AnimatedOutlet from "./component/AnimatedOutlet";
import logo from "./logo.png";

const { Header, Sider, Content } = Layout;

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Sider>
        <div style={{ color: "white", padding: 16 }}>
          <img src={logo} alt="Logo" style={{ width: 150, height: 80 }} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => {
            navigate(e.key);
          }}
          items={[
            { key: "/admin/users", label: "Quản lý người dùng" },
            { key: "/admin/movies", label: "Quản lý phim ngắn" },
            { key: "/admin/reports", label: "Báo cáo- Thống kê" },
            { key: "/admin/series", label: "Quản lý phim bộ" },
            { key: "/admin/notifix", label: "Quản lý thông báo" },
            { key: "/admin/actor", label: "Quản lý diễn viên" }
          ]}
        />
      </Sider>


      <Layout>
        <Header style={{ color: "#fff" }}>
        </Header>

        <Content style={{ margin: "16px" }}>
          <AnimatedOutlet />
        </Content>
      </Layout>

    </Layout>
  );
};

export default AdminPage;