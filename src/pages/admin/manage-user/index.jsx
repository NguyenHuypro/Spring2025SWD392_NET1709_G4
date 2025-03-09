import { Button, Popconfirm, Table } from "antd";
import { useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

export default function UserManagement() {
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Thay đổi</Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc là muốn xóa xe này không?"
            // onConfirm={() => handleDeleteCar(id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/customers");
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useState(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
}
