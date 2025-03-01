import { useNavigate } from "react-router-dom";
import "./index.scss";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/features/counterSlice";

function Login() {
  const navigate = useNavigate();
  const [form] = useForm();
  const dispatch = useDispatch();

  const handleLogin = async (value) => {
    console.log(value);
    try {
      const res = await api.post("/auth/login", value);
      console.log(res.data);
      if (!res.data.errorCode) {
        // localStorage.setItem("token", res?.data?.result.accessToken);
        localStorage.setItem("token", res?.data?.access_token);
        dispatch(login(res?.data));
        if (res.data.role === "ADMIN" || res.data.role === "MANAGER") {
          navigate("/admin/staff");
        } else {
          navigate("/");
        }

        toast.success("Đăng nhập thành công");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="about-container">
      <div className="container">
        <input type="checkbox" id="check" />
        <div className="login form">
          <header>Login</header>
          <Form labelCol={{ span: 24 }} form={form} onFinish={handleLogin}>
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
              <Input type="password" />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            className="btn"
            onClick={() => {
              form.submit();
            }}
          >
            Đăng nhập
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
                  navigate("/forgot-password");
                }}
                style={{ color: "#1677ff" }}
              >
                Quên mật khẩu
              </label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
