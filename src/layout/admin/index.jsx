// import { useState } from "react";
// import { TeamOutlined, UserOutlined } from "@ant-design/icons";
// import { Layout, Menu, theme } from "antd";
// import { Outlet, useNavigate } from "react-router-dom";
// const { Content, Footer, Sider } = Layout;
// const AdminLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   const items = [
//     {
//       key: "staff",
//       icon: <UserOutlined />,
//       label: "Quản lí nhân viên",
//       onClick: () => navigate("/admin/staff"), // Điều hướng khi bấm vào
//     },
//     {
//       key: "users",
//       icon: <TeamOutlined />,
//       label: "Quản lí khách hàng",
//       onClick: () => navigate("/admin/user"), // Điều hướng khi bấm vào
//     },
//     {
//       key: "booking",
//       icon: <TeamOutlined />,
//       label: "Quản lí booking",
//       onClick: () => navigate("/admin/booking"), // Điều hướng khi bấm vào
//     },
//     {
//       key: "package",
//       icon: <TeamOutlined />,
//       label: "Quản lí gói dịch vụ",
//       onClick: () => navigate("/admin/package"), // Điều hướng khi bấm vào
//     },
//     {
//       key: "service",
//       icon: <TeamOutlined />,
//       label: "Quản lí dịch vụ",
//       onClick: () => navigate("/admin/service"), // Điều hướng khi bấm vào
//     },
//   ];
//   return (
//     <Layout
//       style={{
//         minHeight: "100vh",
//       }}
//     >
//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={(value) => setCollapsed(value)}
//       >
//         <div className="demo-logo-vertical" />
//         <Menu
//           theme="dark"
//           defaultSelectedKeys={["staff"]}
//           mode="inline"
//           items={items}
//         />
//       </Sider>
//       <Layout>
//         <Content
//           style={{
//             margin: "0 16px",
//           }}
//         >
//           <Outlet />
//         </Content>
//         <Footer
//           style={{
//             textAlign: "center",
//           }}
//         >
//           Ant Design ©{new Date().getFullYear()} Created by Ant UED
//         </Footer>
//       </Layout>
//     </Layout>
//   );
// };
// export default AdminLayout;
import { useState, useEffect } from "react";
import {
  TeamOutlined,
  UserOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  AppstoreOutlined,
  CarOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Card, Row, Col } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const { Content, Footer, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    staffCount: 0,
    userCount: 0,
    bookingCount: 0,
    serviceCount: 0,
    packageCount: 0,
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // useEffect(() => {
  //   fetchStats();
  // }, []);
  useEffect(() => {
    if (location.pathname === "/admin/dashboard") {
      fetchStats(); // Only fetch stats when on the dashboard
    }
  }, [location.pathname]);

  const fetchStats = async () => {
    try {
      // const res = await api.get("/admin/stats");
      const res = await api.get("/Dashboard/dashboard-data");
      console.log(res.data.result);
      if (!res.data.errorCode) {
        setStats(res.data);
      } else {
        toast.error("Không thể lấy dữ liệu thống kê.");
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu thống kê.");
    }
  };

  const items = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "staff",
      icon: <UserOutlined />,
      label: "Quản lí nhân viên",
      onClick: () => navigate("/admin/staff"),
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Quản lí khách hàng",
      onClick: () => navigate("/admin/user"),
    },
    {
      key: "booking",
      icon: <FileDoneOutlined />,
      label: "Quản lí booking",
      onClick: () => navigate("/admin/booking"),
    },
    {
      key: "package",
      icon: <AppstoreOutlined />,
      label: "Quản lí gói dịch vụ",
      onClick: () => navigate("/admin/package"),
    },
    {
      key: "service",
      icon: <CarOutlined />,
      label: "Quản lí dịch vụ",
      onClick: () => navigate("/admin/service"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={["dashboard"]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Content style={{ margin: "16px" }}>
          
          {/*  Show statistics only on /admin/dashboard */}
          {location.pathname === "/admin/dashboard" && (
            <>
              <Row gutter={16} style={{ marginBottom: "20px" }}>
                <Col span={8}>
                  <Card title="Nhân viên" bordered={false}>
                    <UserOutlined style={{ fontSize: "30px", color: "#1890ff" }} />
                    <h2>{stats.staffCount}</h2>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Khách hàng" bordered={false}>
                    <TeamOutlined style={{ fontSize: "30px", color: "#52c41a" }} />
                    <h2>{stats.userCount}</h2>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Booking" bordered={false}>
                    <FileDoneOutlined style={{ fontSize: "30px", color: "#faad14" }} />
                    <h2>{stats.bookingCount}</h2>
                  </Card>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Gói dịch vụ" bordered={false}>
                    <AppstoreOutlined style={{ fontSize: "30px", color: "#722ed1" }} />
                    <h2>{stats.packageCount}</h2>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Dịch vụ cứu hộ" bordered={false}>
                    <CarOutlined style={{ fontSize: "30px", color: "#eb2f96" }} />
                    <h2>{stats.serviceCount}</h2>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* Nơi hiển thị các trang con */}
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>Car Rescue System ©{new Date().getFullYear()} Created by Dev Team</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
