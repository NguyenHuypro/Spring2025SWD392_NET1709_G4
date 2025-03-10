import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Checkbox,
} from "antd";
import { useState, useEffect } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import { changeCurr } from "../../../utils/utils";

export default function PackageManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [form] = useForm();
  const [currentPackage, setCurrentPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [selectedServices, setSelectedServices] = useState([]); // Dịch vụ được chọn
  const [selectedServiceNames, setSelectedServiceNames] = useState([]); // Tên dịch vụ được chọn

  useEffect(() => {
    fetchPackages();
    fetchServices();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      if (!res.data.errorCode) {
        setDataSource(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("/services"); // Gọi API lấy danh sách dịch vụ
      if (!res.data.errorCode) {
        setServices(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedServices([]);
    setSelectedServiceNames([]);
  };

  const handleSelectService = () => {
    setIsServiceModalOpen(true);
  };

  const handleConfirmServices = () => {
    const selectedNames = services
      .filter((service) => selectedServices.includes(service._id))
      .map((service) => service.name);

    setSelectedServiceNames(selectedNames); // Lưu tên dịch vụ
    form.setFieldsValue({ services: selectedServices }); // Cập nhật vào form
    setIsServiceModalOpen(false);
  };

  const handleServiceCheckboxChange = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmitForm = async (values) => {
    try {
      console.log(values);
      const res = await api.post("/packages", values);
      if (!res.data.errorCode) {
        setDataSource([res.data, ...dataSource]);
        form.resetFields();
        setSelectedServiceNames([]);
        toast.success("Tạo gói dịch vụ mới thành công");
      } else {
        toast.error(res.data.message);
      }
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value) => changeCurr(value),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setCurrentPackage(record);
              setIsModalOpen(true);
            }}
            style={{ marginRight: 20 }}
          >
            Chi tiết
          </Button>
          <Button>Chỉnh sửa</Button>
        </>
      ),
    },
  ];

  const serviceColumns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => changeCurr(price),
    },
  ];
  const serviceColumns2 = [
    {
      title: "Chọn",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Checkbox
          checked={selectedServices.includes(id)}
          onChange={() => handleServiceCheckboxChange(id)}
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
      render: (price) => changeCurr(price),
    },
  ];

  return (
    <>
      <Form
        form={form}
        onFinish={handleSubmitForm}
        layout="vertical"
        style={{
          maxWidth: "800px",
          margin: "auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Please input package name" }]}
            >
              <Input placeholder="Enter package name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Please input description" }]}
            >
              <Input placeholder="Enter description" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: "Please input price" }]}
            >
              <Input type="number" placeholder="Enter price" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Chọn dịch vụ"
              name="services"
              rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
            >
              <Button onClick={handleSelectService}>Nhấn để chọn</Button>
              <p style={{ marginTop: "10px", color: "#1890ff" }}>
                {selectedServiceNames.length > 0
                  ? `Đã chọn: ${selectedServiceNames.join(", ")}`
                  : "Chưa chọn dịch vụ nào"}
              </p>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ fontSize: "16px", height: "50px" }}
          >
            Tạo gói dịch vụ mới
          </Button>
        </Form.Item>
      </Form>

      <Modal open={isModalOpen} onCancel={handleCloseModal} title="Dịch vụ">
        <Table
          dataSource={currentPackage?.services || []}
          columns={serviceColumns}
        />
      </Modal>

      {/* Modal chọn dịch vụ */}
      <Modal
        open={isServiceModalOpen}
        onCancel={handleCloseServiceModal}
        onOk={handleConfirmServices}
        title="Chọn dịch vụ"
      >
        <Table
          dataSource={services}
          columns={serviceColumns2}
          pagination={false}
          rowKey="_id"
        />
      </Modal>

      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
