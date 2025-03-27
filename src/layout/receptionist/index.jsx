// import { useEffect, useState } from "react";
// import { Button, Layout, Menu, Modal, Table, Input, Select } from "antd";
// import { useNavigate } from "react-router-dom";
// import api from "../../configs/axios";
// import { toast } from "react-toastify";

// const { Content, Footer, Sider } = Layout;

// const ReceptionistLayout = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const [dataSource, setDataSource] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newBooking, setNewBooking] = useState({
//     customerName: "",
//     phone: "",
//     licensePlate: "",
//     district: "",
//     ward: "",
//     location: "",
//     description: "",
//   });

//   // State cho quận/huyện và phường/xã
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState("");

//   const items = [
//     {
//       key: "1",
//       label: "Quản lý đặt lịch",
//       onClick: () => navigate("/admin/receptionist"),
//     },
//   ];

//   useEffect(() => {
//     fetchBookings();
//     fetchDistricts();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const res = await api.get("/bookings/guest");
//       console.log(res.data.result);
//       if (!res.data.errorCode) {
//         setDataSource(res.data.result);
//       }
//     } catch (error) {
//       toast.error("Lỗi khi tải danh sách booking!", error);
//     }
//   };

//   const fetchDistricts = async () => {
//     try {
//       const res = await fetch("/api-provinces/p/79?depth=2");
//       const data = await res.json();
//       setDistricts(data.districts.map((d) => ({ label: d.name, value: d.code })));
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách quận/huyện:", error);
//     }
//   };

//   const fetchWards = async (districtCode) => {
//     try {
//       const res = await fetch(`/api-provinces/d/${districtCode}?depth=2`);
//       const data = await res.json();
//       setWards(data.wards.map((w) => ({ label: w.name, value: w.name })));
//     } catch (error) {
//       console.error("Lỗi khi lấy danh sách phường/xã:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
//   };

//   const handleSubmitBooking = async () => {
//     try {
//       const formattedLocation = `${newBooking.location} - ${newBooking.ward} - ${districts.find(d => d.value === newBooking.district)?.label} - TP. Hồ Chí Minh`;
//       const bookingData = { ...newBooking, location: formattedLocation };

//       const res = await api.post("/bookings/receptionist", bookingData);
//       if (!res.data.errorCode) {
//         toast.success("Tạo booking thành công!");
//         fetchBookings();
//         setIsModalOpen(false);
//         setNewBooking({
//           customerName: "",
//           phone: "",
//           licensePlate: "",
//           district: "",
//           ward: "",
//           location: "",
//           description: "",
//         });
//       } else {
//         toast.error("Có lỗi xảy ra khi tạo booking!");
//       }
//     } catch (error) {
//       toast.error("Lỗi: " + error.message);
//     }
//   };

//   const columns = [
//     { title: "Khách hàng", dataIndex: "name", key: "name" },
//     { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
//     { title: "Biển số xe", dataIndex: "licensePlate", key: "licensePlate" },
//     { title: "Vị trí", dataIndex: "location", key: "location" },
//     { title: "Mô tả", dataIndex: "description", key: "description" },
//     { title: "Trạng thái", dataIndex: "status", key: "status" },
//   ];

//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
//         <div className="demo-logo-vertical" />
//         <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
//       </Sider>
//       <Layout>
//         <Content style={{ margin: "0 16px" }}>
//           <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
//             Thêm Booking Mới
//           </Button>
//           <Table dataSource={dataSource} columns={columns} />
//         </Content>
//         <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
//       </Layout>
//       <Modal
//         title="Tiếp nhận Booking mới"
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         onOk={handleSubmitBooking}
//         okText="Xác nhận"
//         cancelText="Hủy"
//       >
//         <Input placeholder="Tên khách hàng" name="customerName" value={newBooking.customerName} onChange={handleInputChange} style={{ marginBottom: 10 }} />
//         <Input placeholder="Số điện thoại" name="phone" value={newBooking.phone} onChange={handleInputChange} style={{ marginBottom: 10 }} />
//         <Input placeholder="Biển số xe" name="licensePlate" value={newBooking.licensePlate} onChange={handleInputChange} style={{ marginBottom: 10 }} />

//         <Select
//           placeholder="Chọn quận/huyện"
//           options={districts}
//           value={newBooking.district}
//           onChange={(value) => {
//             setSelectedDistrict(value);
//             fetchWards(value);
//             setNewBooking({ ...newBooking, district: value, ward: "" });
//           }}
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <Select
//           placeholder="Chọn phường/xã"
//           options={wards}
//           value={newBooking.ward}
//           onChange={(value) => setNewBooking({ ...newBooking, ward: value })}
//           disabled={!selectedDistrict}
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <Input placeholder="Địa chỉ cụ thể" name="location" value={newBooking.location} onChange={handleInputChange} style={{ marginBottom: 10 }} />
//         <Input.TextArea placeholder="Mô tả sự cố" name="description" value={newBooking.description} onChange={handleInputChange} style={{ marginBottom: 10 }} />
//       </Modal>
//     </Layout>
//   );
// };

// export default ReceptionistLayout;


import { useEffect, useState } from "react";
import { Button, Layout, Menu, Modal, Table, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../configs/axios";
import { toast } from "react-toastify";

const { Content, Footer, Sider } = Layout;

const ReceptionistLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    phone: "",
    licensePlate: "",
    district: "",
    ward: "",
    location: "",
    description: "",
  });

  // State cho quận/huyện và phường/xã
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const items = [
    {
      key: "1",
      label: "Quản lý đặt lịch",
      onClick: () => navigate("/admin/receptionist"),
    },
  ];

  useEffect(() => {
    fetchBookings();
    fetchDistricts();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/guest");
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách booking!", error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await fetch("/api-provinces/p/79?depth=2");
      const data = await res.json();
      setDistricts(data.districts.map((d) => ({ label: d.name, value: d.code })));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận/huyện:", error);
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const res = await fetch(`/api-provinces/d/${districtCode}?depth=2`);
      const data = await res.json();
      setWards(data.wards.map((w) => ({ label: w.name, value: w.name })));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường/xã:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
  };

  const handleSubmitBooking = async () => {
    try {
      const formattedLocation = `${newBooking.location} - ${newBooking.ward} - ${districts.find(d => d.value === newBooking.district)?.label} - TP. Hồ Chí Minh`;
      const bookingData = { ...newBooking, location: formattedLocation };

      const res = await api.post("/bookings/receptionist", bookingData);
      if (!res.data.errorCode) {
        toast.success("Tạo booking thành công!");
        fetchBookings();
        setIsModalOpen(false);
        setNewBooking({
          customerName: "",
          phone: "",
          licensePlate: "",
          district: "",
          ward: "",
          location: "",
          description: "",
        });
      } else {
        toast.error("Có lỗi xảy ra khi tạo booking!");
      }
    } catch (error) {
      toast.error("Lỗi: " + error.message);
    }
  };

  const columns = [
    { title: "Khách hàng", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Biển số xe", dataIndex: "licensePlate", key: "licensePlate" },
    { title: "Vị trí", dataIndex: "location", key: "location" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
            Thêm Booking Mới
          </Button>
          <Table dataSource={dataSource} columns={columns} />
        </Content>
        <Footer style={{ textAlign: "center" }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
      </Layout>
      <Modal
        title="Tiếp nhận Booking mới"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmitBooking}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Input placeholder="Tên khách hàng" name="customerName" value={newBooking.customerName} onChange={handleInputChange} style={{ marginBottom: 10 }} />
        <Input placeholder="Số điện thoại" name="phone" value={newBooking.phone} onChange={handleInputChange} style={{ marginBottom: 10 }} />
        <Input placeholder="Biển số xe" name="licensePlate" value={newBooking.licensePlate} onChange={handleInputChange} style={{ marginBottom: 10 }} />

        <Select
          placeholder="Chọn quận/huyện"
          options={districts}
          value={newBooking.district}
          onChange={(value) => {
            setSelectedDistrict(value);
            fetchWards(value);
            setNewBooking({ ...newBooking, district: value, ward: "" });
          }}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <Select
          placeholder="Chọn phường/xã"
          options={wards}
          value={newBooking.ward}
          onChange={(value) => setNewBooking({ ...newBooking, ward: value })}
          disabled={!selectedDistrict}
          style={{ width: "100%", marginBottom: 10 }}
        />

        <Input placeholder="Địa chỉ cụ thể" name="location" value={newBooking.location} onChange={handleInputChange} style={{ marginBottom: 10 }} />
        <Input.TextArea placeholder="Mô tả sự cố" name="description" value={newBooking.description} onChange={handleInputChange} style={{ marginBottom: 10 }} />
      </Modal>
    </Layout>
  );
};

export default ReceptionistLayout;