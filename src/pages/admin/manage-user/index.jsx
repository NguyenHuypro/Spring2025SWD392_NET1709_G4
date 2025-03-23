import { Table } from "antd";
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
