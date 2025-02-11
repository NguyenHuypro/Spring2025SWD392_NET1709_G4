import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import api from "../../../configs/axios";

function Register() {
  const navigate = useNavigate();
  const [form] = useForm();
  const handleRegister = async (value) => {
    console.log(value);
    const res = await api.post("/auth/register");
  };

  return (
    <div className="about-container">
      <div className="container">
        <div className="registration form">
          <header>Signup</header>
          <Form labelCol={{ span: 24 }} form={form} onFinish={handleRegister}>
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
              <Input />
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
              <Input type="email" />
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
              <Input type="number" maxLength={10} />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password",
                },
              ]}
            >
              <Input.Password style={{ height: "65px" }} />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
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
              <Input.Password style={{ height: "65px" }} />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            className="btn"
            onClick={() => {
              form.submit();
            }}
          >
            Signup
          </Button>
          <div className="signup">
            <span className="signup">
              Already have an account?
              <label
                onClick={() => {
                  navigate("/login");
                }}
                style={{ color: "#1677ff" }}
              >
                Login
              </label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
