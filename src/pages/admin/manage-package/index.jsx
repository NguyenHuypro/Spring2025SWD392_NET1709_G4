import {
  Button,
  Col,
  Form,
  Input,
  Modal as AntdModal,
  Row,
  Table,
  Checkbox,
} from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import { changeCurr } from "../../../utils/utils";
import { Modal as ModalInfo } from "antd";
export default function PackageManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [form] = useForm();
  const [currentPackage, setCurrentPackage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
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

  const handleSubmitForm = async (values) => {
    try {
      const payload = {
        ...values,
        services: selectedServices,
      };

      if (isEditMode && currentPackage) {
        const res = await api.put(`/packages/${currentPackage.id}`, payload);
        if (!res.data.errorCode) {
          toast.success("Cập nhật gói dịch vụ thành công");
          form.resetFields();
          setSelectedServices([]);
          setCurrentPackage(null);
          setIsEditMode(false);
          fetchPackages();
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await api.post("/packages", payload);
        if (!res.data.errorCode) {
          setDataSource([res.data.result, ...dataSource]);
          form.resetFields();
          setSelectedServices([]);
          toast.success("Tạo gói dịch vụ mới thành công");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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
              const tableContent = (
                <Table
                  dataSource={record.services}
                  columns={[
                    { title: "Tên dịch vụ", dataIndex: "name", key: "name" },
                    {
                      title: "Giá",
                      dataIndex: "price",
                      key: "price",
                      render: (price) => changeCurr(price),
                    },
                  ]}
                  pagination={false}
                  rowKey="id"
                />
              );

              ModalInfo.info({
                title: "Dịch vụ thuộc gói",
                content: (
                  <div style={{ maxHeight: 400, overflowY: "auto" }}>
                    {tableContent}
                  </div>
                ),
                width: 600,
              });
            }}
          >
            Chi tiết
          </Button>
          <Button
            onClick={() => {
              setIsEditMode(true);
              setCurrentPackage(record);
              setSelectedServices(record.services.map((s) => s.id));
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                price: record.price,
                services: record.services.map((s) => s.id),
              });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Chỉnh sửa
          </Button>
        </>
      ),
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
      {isEditMode && (
        <Button
          onClick={() => {
            setIsEditMode(false);
            form.resetFields();
            setSelectedServices([]);
            setCurrentPackage(null);
          }}
          style={{ marginBottom: 16 }}
        >
          Hủy chỉnh sửa
        </Button>
      )}

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
        <h2 style={{ textAlign: "center", color: "#1890ff", marginBottom: 20 }}>
          {isEditMode ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
        </h2>

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
              <>
                <Button onClick={handleSelectService}>Nhấn để chọn</Button>
                <p style={{ marginTop: "10px", color: "#1890ff" }}>
                  {selectedServiceNames.length > 0
                    ? `Đã chọn: ${selectedServiceNames.join(", ")}`
                    : "Chưa chọn dịch vụ nào"}
                </p>
              </>
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
            {isEditMode ? "Cập nhật gói" : "Tạo gói dịch vụ mới"}
          </Button>
        </Form.Item>
      </Form>

      <AntdModal
        open={isServiceModalOpen}
        onCancel={() => setIsServiceModalOpen(false)}
        onOk={handleConfirmServices}
        title="Chọn dịch vụ"
      >
        <Table
          dataSource={services}
          columns={serviceColumns2}
          pagination={false}
          rowKey="id"
        />
      </AntdModal>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 40 }}
      />
    </>
  );
}
