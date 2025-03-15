import { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, Popconfirm, Row, Col, Select } from "antd";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";

const { Option } = Select;

export default function CarManagement() {
  const [dataSource, setDataSource] = useState([]); // Danh sách xe
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [form] = useForm();

  useEffect(() => {
    fetchCars();
  }, []);

  // Lấy danh sách xe từ API
  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      if (!res.data.errorCode) {
        setDataSource(res.data);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách xe.");
    }
  };

  // Xử lý gửi form (Thêm/Sửa xe)
  const handleSubmitForm = async (values) => {
    try {
      if (editingCar) {
        await api.put(`/cars/${editingCar._id}`, values);
        toast.success("Cập nhật thông tin xe thành công!");
      } else {
        await api.post("/cars", values);
        toast.success("Thêm xe mới thành công!");
      }
      fetchCars();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      toast.error("Lỗi khi xử lý yêu cầu.");
    }
  };

  // Xử lý mở modal để chỉnh sửa xe
  const handleOpenModal = (car = null) => {
    setEditingCar(car);
    setIsModalOpen(true);
    form.setFieldsValue(car || {});
  };

  // Xóa xe
  const handleDeleteCar = async (id) => {
    try {
      await api.delete(`/cars/${id}`);
      toast.success("Xóa xe thành công!");
      fetchCars();
    } catch (error) {
      toast.error("Lỗi khi xóa xe.");
    }
  };

  const columns = [
    {
      title: "Chủ xe",
      dataIndex: "owner",
      key: "owner",
      render: (owner) => owner?.fullName || "N/A",
    },
    {
      title: "Hãng xe",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Mẫu xe",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Biển số",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Thao tác",
      render: (value, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary" onClick={() => handleOpenModal(record)}>
            Chỉnh sửa
          </Button>
          <Popconfirm title="Xóa xe này?" onConfirm={() => handleDeleteCar(record._id)} okText="Có" cancelText="Không">
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => handleOpenModal()} style={{ marginBottom: 16 }}>
        Thêm Xe Mới
      </Button>
      <Table dataSource={dataSource} columns={columns} rowKey="_id" />

      <Modal
        title={editingCar ? "Chỉnh Sửa Xe" : "Thêm Xe Mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={form.submit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmitForm}>
          <Form.Item label="Chủ xe (User ID)" name="ownerId" rules={[{ required: true, message: "Vui lòng nhập ID chủ xe" }]}>
            <Input placeholder="Nhập User ID của chủ xe" />
          </Form.Item>
          <Form.Item label="Hãng xe" name="brand" rules={[{ required: true, message: "Vui lòng nhập hãng xe" }]}>
            <Input placeholder="Nhập hãng xe" />
          </Form.Item>
          <Form.Item label="Mẫu xe" name="model" rules={[{ required: true, message: "Vui lòng nhập mẫu xe" }]}>
            <Input placeholder="Nhập mẫu xe" />
          </Form.Item>
          <Form.Item label="Màu sắc" name="color" rules={[{ required: true, message: "Vui lòng nhập màu xe" }]}>
            <Input placeholder="Nhập màu xe" />
          </Form.Item>
          <Form.Item label="Biển số" name="licensePlate" rules={[{ required: true, message: "Vui lòng nhập biển số xe" }]}>
            <Input placeholder="Nhập biển số xe" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
