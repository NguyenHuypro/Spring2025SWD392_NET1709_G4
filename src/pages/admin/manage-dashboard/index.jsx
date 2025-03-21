import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card, Row, Col, Spin } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardManagement() {
  const [stats, setStats] = useState({
    bookingCount: 0,
    packageCount: 0,
    serviceCount: 0,
    staffCount: 0,
    userCount: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/Dashboard/dashboard-data");
      console.log(res.data.result);
      setLoading(true);
      // Fetch all necessary counts in parallel for better efficiency
      const [bookings, packages, services, staffs, users] = await Promise.all([
        api.get("/bookings"),
        api.get("/packages"),
        api.get("/services"),
        api.get("/users/staffs"),
        api.get("/users/customers"),
        api.get("/revenue/monthly"),
      ]);

      setStats({
        bookingCount: bookings.data.result.length,
        packageCount: packages.data.result.length,
        serviceCount: services.data.result.length,
        staffCount: staffs.data.result.length,
        userCount: users.data.result.length,
        totalRevenue: revenue.data.result.total || 0,
      });
    } catch (error) {
      toast.error("Error fetching statistics.");
    } finally {
      setLoading(false);
    }
  };

  const data = {
    labels: ["Bookings", "Packages", "Services", "Staff", "Users", "Revenue"],
    datasets: [
      {
        label: "Total Count",
        data: [
          stats.bookingCount, 
          stats.packageCount, 
          stats.serviceCount, 
          stats.staffCount, 
          stats.userCount, 
          stats.totalRevenue // Add revenue to chart
        ],
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e74c3c", "#16a085"],
        borderColor: ["#2980b9", "#27ae60", "#f39c12", "#8e44ad", "#c0392b", "#1abc9c"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      {loading ? (
        <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 50 }} />
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={8}><Card title="Total Bookings">{stats.bookingCount}</Card></Col>
            <Col span={8}><Card title="Total Packages">{stats.packageCount}</Card></Col>
            <Col span={8}><Card title="Total Services">{stats.serviceCount}</Card></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Card title="Total Staff">{stats.staffCount}</Card></Col>
            <Col span={12}><Card title="Total Users">{stats.userCount}</Card></Col>
          </Row>

          {/* ✅ New Revenue Section */}
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card title="Total Monthly Revenue ($)">
                <h2 style={{ color: "#27ae60" }}>${stats.totalRevenue.toLocaleString()}</h2>
              </Card>
            </Col>
          </Row>

          <div style={{ marginTop: 20 }}>
            <Bar data={data} />
          </div>
        </>
      )}
    </div>
  );
}