import { useNavigate } from "react-router-dom";
// import "./index.scss";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();
  const [form] = useForm();

  const handleSubmitForm = async (value) => {
    console.log(value);
    try {
      const res = await api.post("/auth/forgot-password", value);
      console.log(res.data);
      if (!res.data.errorCode) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="about-container">
      <div className="container">
        <input type="checkbox" id="check" />
        <div className="login form">
          <header>Quên mật khẩu</header>
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
              <Input type="email" />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            className="btn"
            onClick={() => {
              form.submit();
            }}
          >
            Gửi yêu cầu
          </Button>
          <div className="signup">
            <span className="signup">
              Bạn chưa có tài khoản?
              <label
                onClick={() => {
                  navigate("/register");
                }}
                style={{ color: "#1677ff" }}
              >
                Đăng kí
              </label>
            </span>
          </div>
          <div className="signup">
            <span className="signup">
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

export default ForgotPassword;
