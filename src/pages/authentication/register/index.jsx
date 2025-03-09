import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [form] = useForm();
  const handleRegister = async (value) => {
    try {
      console.log(value);
      const res = await api.post("/auth/register", value);
      console.log(res);
      if (!res.data.errorCode) {
        toast.success(res.data.message);
        // navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
                  message: "Nhập email của bạn",
                },
                {
                  type: "email",
                  message: "Nhập email hợp lệ",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Nhập họ và tên của bạn",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Nhập số điện thoại của bạn",
                },
                {
                  len: 10,
                  message: "Số điện thoại bao gồm 10 số",
                },
              ]}
            >
              <Input type="number" maxLength={10} />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Nhập mật khẩu",
                },
              ]}
            >
              <Input.Password style={{ height: "65px" }} />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="passwordConfirmed"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Xác nhận mật khẩu",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp"));
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
            Đăng kí
          </Button>
          <div className="signup">
            <span className="signup">
              Đã có tài khoản?
              <label
                onClick={() => {
                  navigate("/login");
                }}
                style={{ color: "#1677ff" }}
              >
                Đăng nhập
              </label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
