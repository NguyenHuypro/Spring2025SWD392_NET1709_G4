import { useLocation, useNavigate } from "react-router-dom";
// import "./index.scss";
import { Button, Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const [form] = useForm();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleSubmitForm = async (value) => {
    console.log(value);
    const token = queryParams.get("token");
    console.log(token);
    value.token = token;
    try {
      const res = await api.post("/auth/reset-password", value);
      console.log(res.data);
      if (!res.data.errorCode) {
        toast.success(res.data.message);
        navigate("/login");
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
          <header>Đặt lại mật khẩu</header>
          <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmitForm}>
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
              name="passwordConfirmed"
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
            Reset password
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
