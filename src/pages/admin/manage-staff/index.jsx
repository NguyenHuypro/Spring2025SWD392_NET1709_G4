import { Button, Col, Form, Input, Popconfirm, Row, Select, Table } from "antd";
import { useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";

import {
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
export default function StaffManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [form] = useForm();

  const columns = [
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vị trí",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Thay đổi</Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc là muốn xóa xe này không?"
            // onConfirm={() => handleDeleteCar(id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchStaffs = async () => {
    try {
      const res = await api.get("/users/staffs");
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitForm = async (value) => {
    try {
      console.log(value);
      const res = await api.post("/auth/admin/register", value);
      console.log(res);
      if (!res.data.errorCode) {
        setDataSource([res.data.result, ...dataSource]);
        form.resetFields();
        toast.success("Tạo nhân viên mới thành công");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useState(() => {
    fetchStaffs();
  }, []);

  return (
    <>
      <Form
        form={form}
        onFinish={handleSubmitForm}
        layout="vertical"
        style={{
          maxWidth: "800px", // Tăng chiều rộng
          margin: "auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1890ff",
          }}
        >
          Đăng Ký Nhân Viên
        </h2>

        {/* Chia form thành 2 cột */}
        <Row gutter={16}>
          {/* Email */}
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Nhập email" },
                { type: "email", message: "Nhập email hợp lệ" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Nhập email" />
            </Form.Item>
          </Col>

          {/* Full Name */}
          <Col span={12}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Nhập họ và tên" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Phone */}
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Nhập số điện thoại" },
                { len: 10, message: "Nhập số điện thoại hợp lệ" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                type="tel"
                placeholder="Nhập số điện thoại"
                maxLength={10}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Vị trí"
              name="role"
              rules={[{ required: true, message: "Chọn vị trí" }]}
            >
              <Select
                options={[
                  { label: "Nhân viên cứu hộ", value: "STAFF" },
                  { label: "Lê tân", value: "RECEPTIONIST" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Nhập mật khẩu" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập mật khẩu"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Xác nhận mật khẩu"
              name="passwordConfirmed"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Nhập xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nhập xác nhận mật khẩu"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button (Căn giữa) */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ fontSize: "16px", height: "50px" }}
          >
            Đăng Ký tài khoản nhân viên
          </Button>
        </Form.Item>
      </Form>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
