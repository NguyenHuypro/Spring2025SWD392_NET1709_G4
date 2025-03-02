import { Button, Table } from "antd";
import { changeCurr } from "../../../utils/utils";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/counterSlice";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";

function History() {
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "Thời điểm đặt lịch",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (value) =>
        moment(value).tz("Asia/Bangkok").format("DD-MM-YYYY HH:MM:ss"),
    },

    {
      title: "Thời điểm kết thúc",
      dataIndex: "completedDate",
      key: "completedDate",
      render: (value) =>
        moment(value).tz("Asia/Bangkok").format("DD-MM-YYYY HH:MM:ss"),
    },
    {
      title: "Tình trạng",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => changeCurr(value),
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Thao tác",
      render: (value, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Xem chi tiết</Button>
          {record?.status === "PENDING_PAYMENT" && (
            <Button
              type="primary"
              onClick={() => {
                handleClickPayment(record._id, record.totalPrice);
              }}
            >
              Thanh toán
            </Button>
          )}
        </div>
      ),
    },
  ];

  const fetchBookingsByUserId = async () => {
    try {
      const res = await api.get(`/bookings/user`);
      if (!res.data.errorCode) {
        setDataSource(res.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickPayment = async (id, totalPrice) => {
    console.log(id, totalPrice);
    try {
      const res = await api.post("/payment/booking", { bookingId: id });
      if (!res.data.errorCode) {
        window.open(res.data.paymentUrl, "_blank");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchBookingsByUserId();
  }, []);
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default History;
