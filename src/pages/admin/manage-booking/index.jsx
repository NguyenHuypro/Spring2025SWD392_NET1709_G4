import { Button, Image, Popconfirm, Table } from "antd";
import { useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

export default function BookingManagement() {
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Nhân viên cứu hộ 1",
      dataIndex: "staff1",
      key: "staff1",
      render: (user) => user?.fullName,
    },
    {
      title: "Nhân viên cứu hộ 2",
      dataIndex: "staff2",
      key: "staff2",
      render: (user) => user?.fullName,
    },
    {
      title: "Hình ảnh",
      dataIndex: "evidence",
      key: "evidence",
      render: (image) => (
        <Image
          src={image}
          style={{ width: 200 }}
          placeholder="day la hinh anh"
        />
      ),
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thao tác",
      render: (value) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Chi tiết</Button>
          {value.status === "PENDING" ? (
            <>
              <Popconfirm
                title="Xóa"
                description="Bạn có chắc là muốn xóa xe này không?"
                // onConfirm={() => handleDeleteCar(id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Từ chối</Button>
              </Popconfirm>
              <Button>Phân công</Button>{" "}
            </>
          ) : (
            <Button>Cập nhật</Button>
          )}
        </div>
      ),
    },
  ];

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      if (!res.data.errorCode) {
        setDataSource(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useState(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
