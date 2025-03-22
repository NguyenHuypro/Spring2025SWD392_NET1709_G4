import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/axios";
import { changeCurr } from "../../../utils/utils";

function PaymentHistory() {
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "Mã thanh toán",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Thanh toán cho",
      render: (value, record) => {
        if (record.packageName) {
          return "Gói dịch vụ";
        }
        return "Cứu hộ";
      },
    },
    {
      title: "Xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (value) => changeCurr(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        let color = "";
        let text = "";

        switch (value) {
          case "PENDING":
            color = "gold";
            text = "Đang xử lý";
            break;
          case "SUCCESS":
            color = "green";
            text = "Thành công";
            break;
          case "FAILED":
            color = "red";
            text = "Thất bại";
            break;
          default:
            color = "default";
            text = value;
        }

        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/my-transactions");
      console.log(res.data.result);
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
