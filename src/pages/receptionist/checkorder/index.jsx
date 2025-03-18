import { Button, Card, Input, Typography, Form } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Title } = Typography;

export default function ReceptionistBooking() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmitBooking = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        ...values,
        status: "PENDING",
      });

      if (!res.data.errorCode) {
        toast.success("Tạo booking thành công!");
        form.resetFields();
        navigate("/admin/receptionist");
      } else {
        toast.error("Có lỗi xảy ra khi tạo booking.");
      }
    } catch (error) {
      toast.error("Lỗi khi tiếp nhận booking.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "30px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
        Tiếp Nhận Yêu Cầu Cứu Hộ
      </Title>

      <Card
        title="Nhập Thông Tin Khách Hàng"
        style={{
          marginBottom: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmitBooking}>
          <Form.Item
            label="Tên khách hàng"
            name="customerName"
            rules={[
              { required: true, message: "Vui lòng nhập tên khách hàng!" },
            ]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Biển số xe"
            name="licensePlate"
            rules={[{ required: true, message: "Vui lòng nhập biển số xe!" }]}
          >
            <Input placeholder="Nhập biển số xe" />
          </Form.Item>

          <Form.Item
            label="Vị trí cứu hộ"
            name="location"
            rules={[
              { required: true, message: "Vui lòng nhập địa điểm cứu hộ!" },
            ]}
          >
            <Input placeholder="Nhập địa chỉ hoặc vị trí sự cố" />
          </Form.Item>

          <Form.Item label="Mô tả sự cố" name="description">
            <Input.TextArea placeholder="Nhập mô tả chi tiết về sự cố" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              background: "#1890ff",
              borderColor: "#1890ff",
              fontSize: "18px",
              height: "50px",
            }}
          >
            Gửi Yêu Cầu
          </Button>
        </Form>
      </Card>
    </div>
  );
}
