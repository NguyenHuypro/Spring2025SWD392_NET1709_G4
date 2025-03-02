import { useEffect, useState } from "react";
import { Button, Checkbox, Image, Layout, Menu, Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/counterSlice";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { changeCurr } from "../../utils/utils";
const { Content, Footer, Sider } = Layout;

const RescuerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const user = useSelector(selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState();
  const [totalPrice, setTotalPrice] = useState(0);

  const items = [
    {
      key: "1",
      label: "Quản lí cứu hộ",
      onClick: () => navigate("/admin/staff"), // Điều hướng khi bấm vào
    },
  ];

  useEffect(() => {
    fetchBookingsByRescuerId();
  }, []);

  const fetchBookingsByRescuerId = async () => {
    try {
      const res = await api.get(`/bookings/rescuer/${user._id}`);
      if (!res.data.errorCode) {
        setDataSource(res.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nhiệm vụ!");
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      if (!res.data.errorCode) {
        toast.success("Cập nhật thành công");
        fetchBookingsByRescuerId();
      } else {
        toast.error("Có lỗi xảy ra");
      }
      // Refresh dữ liệu sau khi cập nhật
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      if (!res.data.errorCode) {
        setServices(res.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickFinish = async (value) => {
    console.log(value);
    await fetchServices();
    setIsModalOpen(true);
    setSelectedBooking(value);
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Nhân viên cứu hộ 1",
      dataIndex: "staff1",
      key: "staff1",
      render: (user) => user?.fullName,
    },
    {
      title: "Nhân viên cứu hộ 2",
      dataIndex: "staff2",
      key: "staff2",
      render: (user) => user?.fullName,
    },
    {
      title: "Hình ảnh",
      dataIndex: "evidence",
      key: "evidence",
      render: (image) => (
        <Image
          src={image}
          style={{ width: 200 }}
          placeholder="day la hinh anh"
        />
      ),
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thao tác",
      render: (value, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Chi tiết</Button>
          {value.status === "COMING" && (
            <Button
              onClick={() => updateBookingStatus(record._id, "IN-PROGRESS")}
            >
              Đã đến nơi
            </Button>
          )}
          {value.status === "IN-PROGRESS" && (
            <Button
              onClick={() => {
                handleClickFinish(record._id);
              }}
              type="primary"
            >
              Đã hoàn thành
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleCheckboxChange = (checked, serviceId) => {
    const selectedService = services.find(
      (service) => service._id === serviceId
    );

    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
      setTotalPrice((prevTotal) => prevTotal + (selectedService?.price || 0));
    } else {
      setSelectedServices(
        selectedServices.filter((item) => item !== serviceId)
      );
      setTotalPrice((prevTotal) => prevTotal - (selectedService?.price || 0));
    }
  };
  const serviceColumns = [
    {
      title: "Chọn",
      dataIndex: "_id",
      key: "_id",
      render: (value) => (
        <Checkbox
          checked={selectedServices.includes(value)}
          onChange={(e) => handleCheckboxChange(e.target.checked, value)}
        />
      ),
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value) => changeCurr(value),
    },
  ];

  const handleConfirmCompletion = async () => {
    if (!selectedBooking) {
      toast.error("Lỗi: Không tìm thấy ID của booking!");
      return;
    }
    if (selectedServices.length === 0) {
      toast.error("Chọn ít nhất 1 dịch vụ trước khi tiếp tục");
      return;
    }
    try {
      const res = await api.put(`/bookings/${selectedBooking}/status`, {
        status: "PENDING_PAYMENT",
        totalPrice,
        services: selectedServices,
      });
      if (!res.data.errorCode) {
        toast.success("Cập nhật thành công");
        fetchBookingsByRescuerId();
        setIsModalOpen(false);
      } else {
        toast.error("Có lỗi xảy ra");
      }
      // Refresh dữ liệu sau khi cập nhật
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Table dataSource={dataSource} columns={columns} />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
      <Modal
        title="Xác nhận các dịch vụ đã thực hiện"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedServices([]);
          setTotalPrice(0);
        }}
        onOk={handleConfirmCompletion}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Chọn các dịch vụ đã thực hiện trước khi hoàn thành nhiệm vụ:</p>
        <Table dataSource={services} columns={serviceColumns} />
        <p>
          <strong>Tổng tiền:</strong> {changeCurr(totalPrice)}
        </p>
      </Modal>
    </Layout>
  );
};

export default RescuerLayout;
