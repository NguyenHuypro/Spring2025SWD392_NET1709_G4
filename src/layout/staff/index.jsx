import { useEffect, useState } from "react";
import { Button, Checkbox, Image, Layout, Menu, Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/features/counterSlice";
import api from "../../configs/axios";
import { toast } from "react-toastify";
import { changeCurr } from "../../utils/utils";
const { Content, Footer, Sider } = Layout;

const StaffLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const user = useSelector(selectUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setSetTotalDiscount] = useState(null);

  const items = [
    {
      key: "1",
      label: "Quản lí cứu hộ",
      onClick: () => navigate("/admin/staff"), // Điều hướng khi bấm vào
    },
  ];

  useEffect(() => {
    fetchBookingsByStaffId();
  }, []);

  const fetchBookingsByStaffId = async () => {
    try {
      const res = await api.get(`/bookings/staff/${user.userID}`);
      console.log(res.data.result);
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách nhiệm vụ!", error.message);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      console.log(res.data);
      if (!res.data.errorCode) {
        toast.success("Cập nhật thành công");
        fetchBookingsByStaffId();
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      if (!res.data.errorCode) {
        setServices(res.data.result);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChecking = async () => {
    try {
      const res = await api.post(
        `/bookings/add-service/${selectedBooking.id}`,
        {
          selectedServices,
        }
      );
      setSetTotalDiscount(res.data.result.totalPrice);
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

  const handleConfirmStaff = async (bookingId, staffId) => {
    try {
      const res = await api.post(
        `/bookings/${bookingId}/confirm-staff/${staffId}`
      );
      console.log(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // const handleAgree = async (bookingId, totalDiscount) => {
  //   try {
  //     const res = await api.post("")
  //   } catch (error) {
  //     toast.error("Lỗi khi thanh toán", error.message)
  //   }
  // }

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
            <>
              {user.userID === value.staff1?.id &&
                !value.staff1?.confirmStaff && (
                  <Button
                    onClick={() => handleConfirmStaff(record.id, user.userID)}
                  >
                    Tôi đã đến nơi
                  </Button>
                )}

              {user.userID === value.staff2?.id &&
                !value.staff2?.confirmStaff && (
                  <Button
                    onClick={() => handleConfirmStaff(record.id, user.userID)}
                  >
                    Tôi đã đến nơi
                  </Button>
                )}

              {value.staff1?.confirmStaff && value.staff2?.confirmStaff && (
                <Button disabled>Đã xác nhận đủ</Button>
              )}

              {value.staff1?.confirmStaff &&
                user.userID === value.staff2?.id &&
                !value.staff2?.confirmStaff && (
                  <Button disabled>Chờ bạn xác nhận</Button>
                )}

              {value.staff2?.confirmStaff &&
                user.userID === value.staff1?.id &&
                !value.staff1?.confirmStaff && (
                  <Button disabled>Chờ bạn xác nhận</Button>
                )}
            </>
          )}

          {value.status === "CHECKING" && (
            <>
              <Button
                onClick={() => {
                  setIsModalOpen(true);
                  setSelectedBooking(record);
                }}
              >
                Báo giá
              </Button>
              <Button
                danger
                onClick={() => {
                  updateBookingStatus(record.id, "CANCELLED");
                }}
              >
                Hủy
              </Button>
            </>
          )}
          {value.status === "IN_PROGRESS" && (
            <Button
              onClick={() => {
                handleClickFinish(record.id);
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
      (service) => service.id === serviceId
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
      dataIndex: "id",
      key: "id",
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

  // const handleConfirmCompletion = async () => {
  //   if (!selectedBooking) {
  //     toast.error("Lỗi: Không tìm thấy ID của booking!");
  //     return;
  //   }
  //   if (selectedServices.length === 0) {
  //     toast.error("Chọn ít nhất 1 dịch vụ trước khi tiếp tục");
  //     return;
  //   }
  //   try {
  //     const res = await api.put(`/bookings/${selectedBooking}/status`, {
  //       status: "PENDING_PAYMENT",
  //       totalPrice,
  //       services: selectedServices,
  //     });
  //     console.log(res);
  //     if (!res.data.errorCode) {
  //       toast.success("Cập nhật thành công");
  //       fetchBookingsByStaffId();
  //       setIsModalOpen(false);
  //     } else {
  //       toast.error("Có lỗi xảy ra");
  //     }
  //     // Refresh dữ liệu sau khi cập nhật
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
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
          setSetTotalDiscount(null);
        }}
        onOk={handleChecking}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Chọn các dịch vụ đã thực hiện trước khi hoàn thành nhiệm vụ:</p>
        <Table dataSource={services} columns={serviceColumns} />
        <p>
          <strong>Tạm tính:</strong> {changeCurr(totalPrice)}
        </p>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {totalDiscount ? changeCurr(totalDiscount) : "Chưa tính"}
        </p>
        {totalDiscount && <Button type="primary">Đồng ý sửa</Button>}
      </Modal>
    </Layout>
  );
};

export default StaffLayout;
