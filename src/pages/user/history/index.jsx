import { Button, Table } from "antd";
import { changeCurr } from "../../../utils/utils";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";

function History() {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Thời điểm đặt lịch",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (value) => moment(value).format("DD-MM-YYYY HH:mm:ss"),
    },

    {
      title: "Thời điểm kết thúc",
      dataIndex: "completedDate",
      key: "completedDate",
      render: (value) => {
        if (value) return moment(value).format("DD-MM-YYYY HH:mm:ss");
        return "Chưa hoàn thành";
      },
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
      render: (value) => {
        if (value || value === 0) return changeCurr(value);
        return "Chưa tính";
      },
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
          <Button
            type="primary"
            onClick={() => {
              navigate(`${record.id}`);
            }}
          >
            Xem chi tiết
          </Button>
          {record?.status === "PENDING_PAYMENT" && (
            <Button
              type="primary"
              onClick={() => {
                handleClickPayment(record.id);
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
        setDataSource(res.data.result);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickPayment = async (id) => {
    try {
      const res = await api.post("/payment/booking", { bookingId: id });
      if (!res.data.errorCode) {
        window.open(res.data.result, "_blank");
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
