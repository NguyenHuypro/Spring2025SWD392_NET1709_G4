import { Button, Card, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { changeCurr } from "../../../utils/utils";

const { Title, Text } = Typography;

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("packageId");
  const selectedCarId = searchParams.get("car");
  const navigate = useNavigate();

  const [packageDetails, setPackageDetails] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  // Lấy thông tin gói dịch vụ
  const fetchPackageDetails = async () => {
    try {
      if (!packageId) return;
      const res = await api.get(`/packages/${packageId}`);
      if (!res.data.errorCode) {
        setPackageDetails(res.data.result);
      } else {
        toast.error("Không tìm thấy gói dịch vụ.");
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin gói dịch vụ.");
    }
  };

  const fetchSelectedCar = async () => {
    try {
      if (!selectedCarId) return;
      const res = await api.get(`/cars/my-cars`);
      if (!res.data.errorCode) {
        const car = res.data.result.find((c) => c.id === selectedCarId);
        setSelectedCar(car || null);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách xe.");
    }
  };

  useEffect(() => {
    fetchPackageDetails();
    fetchSelectedCar();
  }, []);

  const handlePayment = async () => {
    if (!selectedCar) {
      toast.error("Vui lòng chọn một xe.");
      return;
    }

    try {
      const paymentData = {
        packageId,
        carId: selectedCar.id, // Chỉ truyền 1 xe
      };

      const res = await api.post("/payment", paymentData);
      console.log(res.data.result);

      if (!res.data.errorCode && res.data.result) {
        window.open(res.data.result, "_blank");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Lỗi trong quá trình thanh toán.");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "30px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
        Xác Nhận Thanh Toán
      </Title>

      {/* Thông tin gói dịch vụ */}
      {packageDetails && (
        <Card
          title="Thông Tin Gói Dịch Vụ"
          style={{
            marginBottom: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Text strong>Tên gói:</Text> {packageDetails.name} <br />
          <Text strong>Mô tả:</Text> {packageDetails.description} <br />
          <Text strong>Giá:</Text>{" "}
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#1890ff" }}
          >
            {changeCurr(packageDetails.price)}
          </span>
        </Card>
      )}

      {/* Thông tin xe đã chọn */}
      {selectedCar && (
        <Card
          title="Xe Đã Chọn"
          style={{
            marginBottom: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Text strong>Hãng xe:</Text> {selectedCar.brand} <br />
          <Text strong>Mẫu xe:</Text> {selectedCar.model} <br />
          <Text strong>Màu sắc:</Text> {selectedCar.color} <br />
          <Text strong>Biển số:</Text> {selectedCar.licensePlate}
        </Card>
      )}

      {/* Nút Thanh toán */}
      <Button
        type="primary"
        size="large"
        block
        onClick={handlePayment}
        disabled={!packageDetails || !selectedCar}
        style={{
          background: "#52c41a",
          borderColor: "#52c41a",
          fontSize: "18px",
          height: "50px",
        }}
      >
        Thanh Toán Ngay
      </Button>
    </div>
  );
}
