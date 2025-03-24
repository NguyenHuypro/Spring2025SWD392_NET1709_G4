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
  Popconfirm,
} from "antd";
import { useState, useEffect } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import { changeCurr } from "../../../utils/utils";

export default function PackageManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [form] = useForm();
  const [editForm] = useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitForm = async (values) => {
    try {
      const res = await api.post("/services", values);
      if (!res.data.errorCode) {
        setDataSource([res.data.result, ...dataSource]);
        form.resetFields();
        toast.success("Tạo dịch vụ mới thành công");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    editForm.setFieldsValue(service);
    setIsEditModalVisible(true);
  };

  const handleUpdateService = async (values) => {
    try {
      const res = await api.put(`/services/${editingService.id}`, values);
      if (!res.data.errorCode) {
        setDataSource((prev) =>
          prev.map((item) =>
            item.id === editingService.id ? { ...item, ...values } : item
          )
        );
        toast.success("Cập nhật dịch vụ thành công");
        setIsEditModalVisible(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const res = await api.delete(`/services/${id}`);
      if (!res.data.errorCode) {
        setDataSource(dataSource.filter((service) => service.id !== id));
        toast.success("Xóa dịch vụ thành công");
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value) => changeCurr(value),
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <>
          <Button type="primary" onClick={() => handleEditService(record)}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc là muốn xóa dịch vụ này không?"
            onConfirm={() => handleDeleteService(id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
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
              rules={[{ required: true, message: "Bắt buộc nhập tên" }]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá"
              name="price"
              rules={[{ required: true, message: "Bắt buộc nhập giá" }]}
            >
              <Input type="number" placeholder="Nhập giá" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ fontSize: "16px", height: "50px" }}>
            Tạo dịch vụ mới
          </Button>
        </Form.Item>
      </Form>

      <Table dataSource={dataSource} columns={columns} />

      <Modal
        title="Chỉnh sửa dịch vụ"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleUpdateService} layout="vertical">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Bắt buộc nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Bắt buộc nhập giá" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
