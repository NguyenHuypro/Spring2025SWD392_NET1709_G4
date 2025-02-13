/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../redux/features/counterSlice";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";

function Header() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
              <Form form={form} labelCol={{ span: 24 }}>
                <FormItem
                  label="Tên chủ xe"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Tên chủ xe không được để trống",
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
                <FormItem
                  label="Xe"
                  name="car"
                  rules={[
                    {
                      required: true,
                      message: "Địa điểm cứu hộ không được để trống",
                    },
                  ]}
                >
                  <Select
                    options={[
                      { value: "messiu", label: "MESSIU" },
                      { value: "messiu1", label: "MESSIU1" },
                    ]}
                  />
                </FormItem>
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
                <Link to="/combo-service">Lịch sử cứu hộ</Link>
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
          <div style={{ fontSize: 20 }}>
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
