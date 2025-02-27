import { Col, Form, Input } from "antd";
import "./index.scss";
import { UserOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/counterSlice";
function Profile() {
  const [form] = useForm();
  const user = useSelector(selectUser);
  return (
    <Col span={24} className="profile">
      <h2>Hồ sơ cá nhân</h2>
      <UserOutlined className="icon" />
      <Form labelCol={{ span: 24 }} form={form}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
            {
              type: "email",
              message: "Please input a valid email",
            },
          ]}
        >
          <Input defaultValue={user.email} />
        </Form.Item>
        <Form.Item
          label="Fullname"
          name="fullname"
          rules={[
            {
              required: true,
              message: "Please input your fullname",
            },
          ]}
        >
          <Input defaultValue={user.fullName} />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your your phone number",
            },
            {
              len: 10,
              message: "A valid phone number contains 10 digits",
            },
          ]}
        >
          <Input type="number" maxLength={10} defaultValue={user.phone} />
        </Form.Item>
      </Form>
    </Col>
  );
}

export default Profile;
