import { Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function PaymentHistory() {
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "Mã thanh toán",
      dataIndex: "id",
      key: "id",
    },
  ];

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/my-transactions");
      setDataSource(res.data.result);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
}

export default PaymentHistory;
