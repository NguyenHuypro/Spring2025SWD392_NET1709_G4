import { Button, Col, Form, Input, Popconfirm, Row, Select, Table } from "antd";
import React, { useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import FormItem from "antd/es/form/FormItem";
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
      dataIndex: "_id",
      key: "_id",
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
        setDataSource(res.data);
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
        setDataSource([...dataSource, res.data]);
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
                { required: true, message: "Please input your email" },
                { type: "email", message: "Please input a valid email" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>
          </Col>

          {/* Full Name */}
          <Col span={12}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please input your full name" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Phone */}
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number" },
                { len: 10, message: "A valid phone number contains 10 digits" },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                type="tel"
                placeholder="Enter your phone number"
                maxLength={10}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Vị trí"
              name="role"
              rules={[{ required: true, message: "Please input role" }]}
            >
              <Select
                options={[
                  { label: "Nhân viên cứu hộ", value: "RESCUER" },
                  { label: "Lê tân", value: "RECEPTIONIST" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Confirm Password"
              name="passwordConfirmed"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your password"
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
