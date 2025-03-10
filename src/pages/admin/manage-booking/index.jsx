import {
  Button,
  Image,
  Modal,
  Popconfirm,
  Table,
  Select,
  Descriptions,
  Row,
  Card,
  Col,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { changeCurr } from "../../../utils/utils";
import moment from "moment-timezone";
const { Text } = Typography;

export default function BookingManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModal2Open, setIsModal2Open] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAvailableStaffs = async (bookingId) => {
    try {
      const res = await api.get(
        `/users/available-staffs?bookingId=${bookingId}`
      );
      if (!res.data.errorCode) {
        setStaffs(res.data.result);
        setIsModalOpen(true); // Mở modal sau khi lấy dữ liệu
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAssignClick = (booking) => {
    setSelectedBooking(booking);
    fetchAvailableStaffs(booking.id);
  };

  const handleAssignStaffs = async () => {
    if (selectedStaffs.length !== 2) {
      toast.error("Bạn phải chọn đúng 2 nhân viên cứu hộ!");
      return;
    }

    try {
      await api.put(`/bookings/${selectedBooking.id}/assign`, {
        staff1: selectedStaffs[0],
        staff2: selectedStaffs[1],
      });

      toast.success("Phân công nhân viên cứu hộ thành công!");
      fetchBookings();
      setIsModalOpen(false);
      setSelectedStaffs([]);
    } catch (error) {
      toast.error(error.message);
    }
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
          <Button
            type="primary"
            onClick={() => {
              setSelectedBooking(record);
              setIsModal2Open(true);
            }}
          >
            Chi tiết
          </Button>
          {value.status === "PENDING" ? (
            <>
              <Popconfirm
                title="Xóa"
                description="Bạn có chắc là muốn từ chối booking này không?"
                okText="Yes"
                cancelText="No"
                onConfirm={async () => {
                  const res = await api.put(`/bookings/${record.id}/status`, {
                    status: "CANCELLED",
                  });
                  fetchBookings();
                }}
              >
                <Button danger>Từ chối</Button>
              </Popconfirm>
              <Button
                onClick={() => {
                  handleAssignClick(record);
                }}
              >
                Phân công
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  const bookingStatusMap = {
    PENDING: { label: "Đang chờ xử lý", color: "warning" },
    COMING: { label: "Đã xác nhận", color: "success" },
    CHECKING: { label: "Đang kiểm tra và báo giá", color: "processing" },
    IN_PROGRESS: { label: "Đang thực hiện", color: "processing" },
    PENDING_PAYMENT: { label: "Chờ thanh toán", color: "processing" },
    FINISHED: { label: "Hoàn thành", color: "success" },
    CANCELLED: { label: "Đã hủy", color: "danger" },
  };

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />

      <Modal
        open={isModal2Open}
        onCancel={() => {
          setIsModal2Open(false);
          setSelectedBooking(null);
        }}
        width={1200}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          {" "}
          <Card
            title="Thông tin chi tiết"
            bordered={false}
            style={{
              width: 1200,
              borderRadius: 10,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Row gutter={16}>
              {/* Cột hình ảnh */}
              <Col span={12}>
                <Image
                  src={selectedBooking?.evidence}
                  style={{ borderRadius: 10, objectFit: "cover" }}
                  width={500}
                />
              </Col>

              {/* Cột thông tin chi tiết */}
              <Col span={12}>
                <Descriptions column={1} bordered size="middle">
                  <Descriptions.Item label="Tên người đặt">
                    <Text strong>
                      {selectedBooking?.name || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <Text>{selectedBooking?.phone || "Không xác địch"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Biển số xe">
                    <Text>
                      {selectedBooking?.licensePlate || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa điểm cứu hộ">
                    <Text>{selectedBooking?.location || "Không xác địch"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng">
                    <Text type="danger">
                      {selectedBooking?.description || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái booking">
                    <Text
                      type={
                        bookingStatusMap[selectedBooking?.status]?.color ||
                        "secondary"
                      }
                    >
                      {bookingStatusMap[selectedBooking?.status]?.label ||
                        "Không xác định"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhân viên cứu hộ 1">
                    <Text type="secondary">
                      {selectedBooking?.staff1?.fullName || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại nhân viên cứu hộ 1">
                    <Text type="secondary">
                      {selectedBooking?.staff1?.phone || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>

                  <Descriptions.Item label="Nhân viên cứu hộ 2">
                    <Text type="secondary">
                      {selectedBooking?.staff2?.fullName || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại nhân viên cứu hộ 2">
                    <Text type="secondary">
                      {selectedBooking?.staff2?.phone || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian đến">
                    <Text type="secondary">
                      {moment(selectedBooking?.arrivalDate).format(
                        "DD-MM-YYYY HH:mm:ss"
                      ) || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian hoàn thành">
                    <Text type="secondary">
                      {moment(selectedBooking?.completedDate).format(
                        "DD-MM-YYYY HH:mm:ss"
                      ) || "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Các dịch vụ đã làm">
                    {selectedBooking?.services?.map((service) => (
                      <Text type="secondary" key={service.id}>
                        {service?.name}
                      </Text>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">
                    <Text type="danger">
                      {!isNaN(selectedBooking?.totalPrice)
                        ? changeCurr(selectedBooking?.totalPrice)
                        : "Không xác địch"}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>

      {/* Modal Phân công */}
      <Modal
        title="Phân công nhân viên cứu hộ"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedStaffs([]);
        }}
        onOk={handleAssignStaffs}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Vui lòng chọn đúng 2 nhân viên cứu hộ:</p>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Chọn nhân viên cứu hộ"
          value={selectedStaffs}
          onChange={setSelectedStaffs}
          maxTagCount={2}
        >
          {staffs.map((staff) => (
            <Select.Option key={staff.id} value={staff.id}>
              {staff.fullName}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
}
