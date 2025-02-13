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
      localStorage.setItem("token", res?.data?.result.accessToken);
      dispatch(login(res?.data?.result));
      navigate("/");
      toast.success("Đăng nhập thành công");
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
            Login
          </Button>
          <div className="signup">
            <span className="signup">
              You do not have an account?
              <label
                onClick={() => {
                  navigate("/register");
                }}
                style={{ color: "#1677ff" }}
              >
                Signup
              </label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
