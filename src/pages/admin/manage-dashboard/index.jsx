import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Card, Row, Col, Spin } from "antd";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import { changeCurr } from "../../../utils/utils";

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
  const [monthlyRevenueData, setMonthlyRevenueData] = useState(new Array(12).fill(0));

  const fetchStats = async () => {
    try {
      const res = await api.get("/Dashboard/dashboard-data");
      console.log(res.data.result);
      setLoading(true);
      // Fetch all necessary counts in parallel for better efficiency
      //const [bookings, packages, services, staffs, users] = await Promise.all([
      //  api.get("/bookings"),
      //  api.get("/packages"),
      //  api.get("/services"),
      //  api.get("/users/staffs"),
      //  api.get("/users/customers"),
      //  api.get("/revenue/monthly"),
      //]);

      setStats({
        bookingCount: res.data.result.bookingCount,
        packageCount: res.data.result.packageCount,
        serviceCount: res.data.result.serviceCount,
        staffCount: res.data.result.staffCount,
        receptionistCount : res.data.result.receptionistCount,
        userCount: res.data.result.customerCount,
        totalRevenue: res.data.result.monthlyRevenue,
      });
      const monthlyData = new Array(12).fill(0); 
      res.data.result.monthlyRevenues.forEach((item) => {
        monthlyData[item.month - 1] = item.revenue; 
      });
      setMonthlyRevenueData(monthlyData);
    } catch (error) {
      toast.error("Error fetching statistics.");
    } finally {
      setLoading(false);
    }
  };
  

  const data = {
    labels: ["Bookings", "GÓI", "DỊCH VỤ", "NHÂN VIÊN", "LỄ TÂN", "KHÁCH HÀNG"],
    datasets: [
      {
        label: "Số lượng",
        data: [
          stats.bookingCount, 
          stats.packageCount, 
          stats.serviceCount, 
          stats.staffCount, 
          stats.receptionistCount,
          stats.userCount, 
        ],
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#9b59b6", "#e74c3c", "#16a085"],
        borderColor: ["#2980b9", "#27ae60", "#f39c12", "#8e44ad", "#c0392b", "#1abc9c"],
        borderWidth: 1,
      },
    ],
  };

  const revenueChartData = {
    labels: [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    datasets: [
      {
        label: "Doanh Thu (VND)",
        data: monthlyRevenueData, // Dữ liệu doanh thu của từng tháng
        backgroundColor: "#16a085",
        borderColor: "#1abc9c",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div style={{ padding: 20 }}>
      {loading ? (
        <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: 50 }} />
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={8}><Card title="Tổng Bookings">{stats.bookingCount}</Card></Col>
            <Col span={8}><Card title="Tổng gói dịch vụ">{stats.packageCount}</Card></Col>
            <Col span={8}><Card title="Tổng dịch vụ">{stats.serviceCount}</Card></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Card title="Tổng nhân viên">{stats.staffCount}</Card></Col>
            <Col span={12}><Card title="Tổng lễ tân">{stats.receptionistCount}</Card></Col>
            <Col span={12}><Card title="Tổng người dùng">{stats.userCount}</Card></Col>
          </Row>

          {/* ✅ New Revenue Section */}
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={24}>
              <Card title="Tổng doanh thu tháng">
                <h2 style={{ color: "#27ae60" }}>{changeCurr(stats.totalRevenue)}</h2>
              </Card>
            </Col>
          </Row>


          <div style={{ marginTop: 20 }}>
            <Bar data={data} />
          </div>
          <div style={{ marginTop: 30 }}>
              <h2 style={{ textAlign: "center", color: "#2c3e50" }}>Biểu đồ doanh thu hàng tháng</h2>
          <Bar data={revenueChartData} />
        </div>
        </>
      )}
    </div>
  );
}