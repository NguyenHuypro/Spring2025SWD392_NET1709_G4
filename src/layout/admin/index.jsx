import { useState } from "react";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
const { Content, Footer, Sider } = Layout;
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    {
      key: "staff",
      icon: <UserOutlined />,
      label: "Quản lí nhân viên",
      onClick: () => navigate("/admin/staff"), // Điều hướng khi bấm vào
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Quản lí khách hàng",
      onClick: () => navigate("/admin/user"), // Điều hướng khi bấm vào
    },
    {
      key: "booking",
      icon: <TeamOutlined />,
      label: "Quản lí booking",
      onClick: () => navigate("/admin/booking"), // Điều hướng khi bấm vào
    },
    {
      key: "package",
      icon: <TeamOutlined />,
      label: "Quản lí gói dịch vụ",
      onClick: () => navigate("/admin/package"), // Điều hướng khi bấm vào
    },
    {
      key: "service",
      icon: <TeamOutlined />,
      label: "Quản lí dịch vụ",
      onClick: () => navigate("/admin/service"), // Điều hướng khi bấm vào
    },
  ];
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["staff"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Outlet />
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
