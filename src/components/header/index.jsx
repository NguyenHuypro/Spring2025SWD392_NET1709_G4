/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/features/counterSlice";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import api from "../../configs/axios";
import uploadFile from "../../utils/upload";

function Header() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [cars, setCars] = useState([]);
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const fetchCarByUserId = async () => {
    try {
      const res = await api.get("/cars/my-cars");
      if (!res.data.errorCode) {
        setCars(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitForm = async (value) => {
    try {
      const url = await uploadFile(value.image.fileList[0].originFileObj);
      value.evidence = url;
      const res = await api.post("/bookings", value);
      console.log(res.data.message);
      if (res.data.result) {
        toast.success("Đặt cứu hộ thành công");
        form.resetFields();
        setIsModalOpen(false);
        navigate("/history");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <div
          className="header-left__logo"
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            src="https://e-cdn.carpla.vn/carpla-assets/carplavn/img/logo.b4dfc79.png"
            alt="Đây là logo"
          />
        </div>

        {user && (
          <>
            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
                fetchCarByUserId();
              }}
            >
              Đặt cứu hộ ngay
            </Button>
            <Modal
              title="Thông tin cứu hộ"
              open={isModalOpen}
              onCancel={handleCancel}
              onOk={handleOk}
            >
              <Form
                form={form}
                labelCol={{ span: 24 }}
                onFinish={handleSubmitForm}
              >
                <FormItem
                  label="Xe"
                  name="carId"
                  rules={[
                    {
                      required: true,
                      message: "Xe không được để trống",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn xe"
                    options={cars.map((car) => ({
                      label: `${car.brand} ${car.model} ${car.licensePlate}`,
                      value: car.id,
                    }))}
                  />
                </FormItem>

                <FormItem
                  label="Tình trạng"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Tình trạng xe không được để trống",
                    },
                  ]}
                >
                  <Input />
                </FormItem>
                <FormItem
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Số điện thoại không được để trống",
                    },
                    {
                      len: 10,
                      message: "Số điện thoại phải bao gồm 10 số",
                    },
                  ]}
                  initialValue={user.phone}
                >
                  <Input />
                </FormItem>
                <FormItem
                  label="Địa điểm cứu hộ"
                  name="location"
                  rules={[
                    {
                      required: true,
                      message: "Địa điểm cứu hộ không được để trống",
                    },
                  ]}
                >
                  <Input />
                </FormItem>

                <Form.Item label="Hình ảnh" name="image">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={() => false} // Ngăn auto-upload, xử lý sau
                  >
                    {fileList.length < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <ul
              style={{
                display: "flex",
                gap: "20px",
                listStyle: "none",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "15px",
              }}
            >
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/my-cars">Xe của bạn</Link>
              </li>
              <li>
                <Link to="/history">Lịch sử cứu hộ</Link>
              </li>
              <li>
                <Link to="/package">Gói dịch vụ</Link>
              </li>
            </ul>
          </>
        )}
        {/* {user?.role == "CUSTOMER" && (
          <nav className="navbar navbar-expand-lg navbar-light">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <a className="nav-link" href="#">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Pricing
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" href="#">
                    Disabled
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        )} */}
      </div>
      {user == null ? (
        <div className="header-right">
          <div className="header-right__login">
            <Button
              type="primary"
              onClick={() => {
                navigate("/login");
              }}
            >
              Đăng nhập
            </Button>
          </div>
          <div className="header-right__register">
            <Button
              type=""
              onClick={() => {
                navigate("/register");
              }}
            >
              Đăng kí
            </Button>
          </div>
        </div>
      ) : (
        <div className="header-right">
          <div style={{ fontSize: 20 }}>{user.fullName}</div>
          <div
            style={{ fontSize: 20 }}
            onClick={() => {
              navigate("/profile");
            }}
          >
            <UserOutlined />
          </div>

          <div className="header-right__information">
            <Button
              type=""
              onClick={() => {
                dispatch(logout());
                navigate("/");
                toast.success("Đăng xuất thành công");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
