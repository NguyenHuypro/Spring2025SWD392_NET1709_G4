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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [isButtonShow, setIsButtonShow] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
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
                  fetchServices();
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

          {value.status === "PENDING_PAYMENT" && (
            <Button disabled>Chờ khách hàng thanh toán</Button>
          )}
          {value.status === "IN_PROGRESS" && (
            <Button
              onClick={() => {
                updateBookingStatus(record.id, "FINISHED");
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
  useEffect(() => {
    fetchBookingsByStaffId();
  }, []);

  const fetchBookingsByStaffId = async () => {
    try {
      const res = await api.get(`/bookings/staff/${user.userID}`);
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

      if (!res.data.errorCode) {
        toast.success("Cập nhật thành công");
        fetchBookingsByStaffId();
        setIsModalOpen(false);
        setIsDisable(true);
      } else {
        toast.error("Có lỗi xảy ra");
      }
      setIsButtonShow(false);
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

  const handleConfirmStaff = async (bookingId, staffId) => {
    try {
      const res = await api.post(
        `/bookings/${bookingId}/confirm-staff/${staffId}`
      );
      fetchBookingsByStaffId();
      console.log(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChecking = async () => {
    if (!selectedBooking) return;
    try {
      const res = await api.post(
        `/bookings/add-service/${selectedBooking.id}`,
        {
          selectedServices,
        }
      );

      // Đặt totalDiscount trước, sau đó hiển thị nút "Đồng ý sửa"
      const discount = res.data.result?.totalPrice ?? 0;
      setTotalDiscount(discount);
      toast.success("Đã báo giá");

      // Nếu đã có giá trị totalDiscount, hiển thị nút
      if (discount !== null && discount !== undefined) {
        setIsButtonShow(true);
      }
      setIsDisable(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (totalDiscount !== null && totalDiscount !== undefined) {
      setIsButtonShow(true);
    }
  }, [totalDiscount]);

  const handleCheckboxChange = (checked, serviceId) => {
    const selectedService = services.find(
      (service) => service.id === serviceId
    );
    const price = selectedService?.price || 0;

    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
      setTotalPrice((prevTotal) => prevTotal + price);
    } else {
      setSelectedServices(
        selectedServices.filter((item) => item !== serviceId)
      );
      setTotalPrice((prevTotal) => prevTotal - price);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" onClick={() => navigate("/admin/staff")}>
            Quản lí cứu hộ
          </Menu.Item>
        </Menu>
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
          setTotalDiscount(0);
          setIsButtonShow(false);
        }}
        onOk={handleChecking}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Chọn các dịch vụ đã thực hiện trước khi hoàn thành nhiệm vụ:</p>
        <Table
          dataSource={services}
          columns={[
            {
              title: "Chọn",
              dataIndex: "id",
              key: "id",
              render: (value) => (
                <Checkbox
                  checked={selectedServices.includes(value)}
                  onChange={(e) =>
                    handleCheckboxChange(e.target.checked, value)
                  }
                />
              ),
            },
            { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
            {
              title: "Giá",
              dataIndex: "price",
              key: "price",
              render: changeCurr,
            },
          ]}
        />

        <p>
          <strong>Tạm tính:</strong> {changeCurr(totalPrice)}
        </p>
        <p>
          <strong>Tổng tiền:</strong> {changeCurr(totalDiscount)}
        </p>

        {isButtonShow && (
          <Button
            type="primary"
            onClick={() =>
              updateBookingStatus(selectedBooking.id, "PENDING_PAYMENT")
            }
            disabled={isDisable}
          >
            Đồng ý sửa
          </Button>
        )}
      </Modal>
    </Layout>
  );
};

export default StaffLayout;
