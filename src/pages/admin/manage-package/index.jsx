import { Button, Col, Form, Input, Modal, Row, Table, Checkbox } from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
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

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      console.log(res.data.result);
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchServices = useCallback(async () => {
    try {
      const res = await api.get("/services");
      if (!res.data.errorCode) {
        setServices(res.data.result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCloseServiceModal = () => setIsServiceModalOpen(false);

  const handleSelectService = async () => {
    if (services.length === 0) await fetchServices();
    setIsServiceModalOpen(true);
  };

  const handleConfirmServices = () => {
    setIsServiceModalOpen(false);
    form.setFieldsValue({ services: selectedServices });
  };

  const handleServiceCheckboxChange = useCallback((serviceId, checked) => {
    setSelectedServices((prev) =>
      checked ? [...prev, serviceId] : prev.filter((id) => id !== serviceId)
    );
  }, []);

  const handleSubmitForm = async (values) => {
    try {
      console.log(values);
      const res = await api.post("/packages", values);
      if (!res.data.errorCode) {
        setDataSource([res.data.result, ...dataSource]);
        form.resetFields();
        setSelectedServices([]);
        toast.success("Tạo gói dịch vụ mới thành công");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const selectedServiceNames = useMemo(() => {
    return services
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => service.name);
  }, [selectedServices, services]);

  const renderCheckbox = useCallback(
    (id) => (
      <Checkbox
        checked={selectedServices.includes(id)}
        onChange={(e) => handleServiceCheckboxChange(id, e.target.checked)}
      />
    ),
    [selectedServices, handleServiceCheckboxChange]
  );

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
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
    { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => changeCurr(price),
    },
  ];

  const serviceColumns2 = [
    { title: "Chọn", dataIndex: "id", key: "id", render: renderCheckbox },
    { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => changeCurr(price),
    },
  ];
  useEffect(() => {
    fetchPackages();
  }, []);
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
              rules={[{ required: true, message: "Bắt buộc nhập tên gói" }]}
            >
              <Input placeholder="Nhập tên gói" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Bắt buộc nhập mô tả" }]}
            >
              <Input placeholder="Nhập mô tả" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: "Bắt buộc nhập giá" }]}
            >
              <Input type="number" placeholder="Nhập giá" />
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
          rowKey="id"
        />
      </Modal>

      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
