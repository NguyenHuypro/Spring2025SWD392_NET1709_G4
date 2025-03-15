import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { Card, Row, Col, Image, Typography, Descriptions } from "antd";
import { changeCurr } from "../../../utils/utils";
import moment from "moment-timezone";
const { Text } = Typography;

export default function Detail() {
  const { id } = useParams();
  const [booking, setBooking] = useState();
  const bookingStatusMap = {
    PENDING: { label: "Đang chờ xử lý", color: "warning" },
    COMING: { label: "Đã xác nhận", color: "success" },
    CHECKING: { label: "Đang kiểm tra và báo giá", color: "processing" },
    IN_PROGRESS: { label: "Đang thực hiện", color: "processing" },
    PENDING_PAYMENT: { label: "Chờ thanh toán", color: "processing" },
    FINISHED: { label: "Hoàn thành", color: "success" },
    CANCELLED: { label: "Đã hủy", color: "danger" },
  };
  const fetchBookingById = async () => {
    try {
      const res = await api.get(`/bookings/${id}`);
      if (!res.data.errorCode) {
        setBooking(res.data.result);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBookingById();
  }, []);
  return (
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
              src={booking?.evidence}
              style={{ borderRadius: 10, objectFit: "cover" }}
              width={500}
            />
          </Col>

          {/* Cột thông tin chi tiết */}
          <Col span={12}>
            <Descriptions column={1} bordered size="middle">
              <Descriptions.Item label="Tên người đặt">
                <Text strong>{booking?.name || "Không xác địch"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                <Text>{booking?.phone || "Không xác địch"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Biển số xe">
                <Text>{booking?.licensePlate || "Không xác địch"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Địa điểm cứu hộ">
                <Text>{booking?.location || "Không xác địch"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Tình trạng">
                <Text type="danger">
                  {booking?.description || "Không xác địch"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái booking">
                <Text
                  type={bookingStatusMap[booking?.status]?.color || "secondary"}
                >
                  {bookingStatusMap[booking?.status]?.label || "Không xác định"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Nhân viên cứu hộ 1">
                <Text type="secondary">
                  {booking?.staff1?.fullName || "Không xác địch"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại nhân viên cứu hộ 1">
                <Text type="secondary">
                  {booking?.staff1?.phone || "Không xác địch"}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label="Nhân viên cứu hộ 2">
                <Text type="secondary">
                  {booking?.staff2?.fullName || "Không xác địch"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại nhân viên cứu hộ 2">
                <Text type="secondary">
                  {booking?.staff2?.phone || "Không xác địch"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian đến">
                <Text type="secondary">
                  {moment(booking?.arrivalDate).format("DD-MM-YYYY HH:mm:ss") ||
                    "Không xác địch"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian hoàn thành">
                <Text type="secondary">
                  {moment(booking?.completedDate).format(
                    "DD-MM-YYYY HH:mm:ss"
                  ) || "Không xác địch"}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Các dịch vụ đã làm">
                {booking?.services?.map((service, index) => {
                  if (index === booking.services.length - 1)
                    return (
                      <Text type="secondary" key={service.id}>
                        {`${service?.name}`}
                      </Text>
                    );
                  return (
                    <Text type="secondary" key={service.id}>
                      {`${service?.name}, `}
                    </Text>
                  );
                })}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text type="danger">
                  {!isNaN(booking?.totalPrice)
                    ? changeCurr(booking?.totalPrice)
                    : "Không xác địch"}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
