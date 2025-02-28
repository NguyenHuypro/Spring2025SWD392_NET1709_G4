import { Button, Col, Form, Input } from "antd";
import "./index.scss";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/counterSlice";
import { useEffect, useState } from "react";
function Profile() {
  const [form] = useForm();
  const user = useSelector(selectUser);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleSubmitForm = async (value) => {
    console.log(value);
  };

  useEffect(() => {
    form.setFieldsValue({
      email: user?.email,
      fullname: user?.fullName,
      phone: user?.phone,
    });
  }, [user, form]);

  return (
    <Col span={24} className="profile">
      <h2>Hồ sơ cá nhân</h2>
      <div>
        <UserOutlined className="icon" />
        <EditOutlined
          onClick={() => {
            setIsDisabled(!isDisabled);
          }}
        />
      </div>

      <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmitForm}>
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
          <Input defaultValue={user.email} disabled={isDisabled} />
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
          value
        >
          <Input defaultValue={user.fullName} disabled={isDisabled} />
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
          <Input
            type="number"
            maxLength={10}
            defaultValue={user.phone}
            disabled={isDisabled}
          />
        </Form.Item>
        {isDisabled == false && (
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={() => {
              form.submit();
            }}
          >
            Update
          </Button>
        )}
      </Form>
    </Col>
  );
}

export default Profile;
