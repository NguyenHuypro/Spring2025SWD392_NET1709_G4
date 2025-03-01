import { Button, Col, Form, Input } from "antd";
import "./index.scss";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "../../../redux/features/counterSlice";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
function Profile() {
  const [form] = useForm();
  const user = useSelector(selectUser);
  const [isDisabled, setIsDisabled] = useState(true);
  const dispatch = useDispatch();

  const handleSubmitForm = async (value) => {
    console.log(value);
    try {
      const res = await api.put("/users", value);
      if (!res.data.errorCode) {
        dispatch(login(res?.data));
        toast.success("Chỉnh sửa thành công");
        setIsDisabled(true);
      } else {
        toast.error("Chỉnh sửa thất bại");
      }
    } catch (error) {
      toast.error(error.message);
    }
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
        <Form.Item label="Email" name="email">
          <Input defaultValue={user.email} disabled />
        </Form.Item>
        <Form.Item
          label="Fullname"
          name="fullName"
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
