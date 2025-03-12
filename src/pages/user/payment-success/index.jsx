import { useEffect } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.scss";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const transactionStatus = queryParams.get("transactionStatus");
  const transactionId = queryParams.get("vnp_TxnRef");

  const handleUpdateTransactionStatus = async () => {
    try {
      const res = await api.put("/payment/callback", {
        transactionId,
      });
      console.log(res.data.result);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (transactionStatus) {
      handleUpdateTransactionStatus();
    }
  }, [transactionStatus]);

  return (
    <div className="payment-success-container">
      <div className="payment-success-box">
        {transactionStatus === "00" ? (
          <>
            <CheckCircleOutlined className="success-icon" />
            <h2 className="success-title">Thanh toán thành công!</h2>
            <p className="success-message">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận.
            </p>
          </>
        ) : transactionStatus === "02" ? (
          <>
            <CloseCircleOutlined className="failed-icon" />
            <h2 className="failed-title">Thanh toán thất bại!</h2>
            <p className="failed-message">
              Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
            </p>
          </>
        ) : (
          <Spin size="large" />
        )}
        <Button
          type="primary"
          className="success-button"
          onClick={() => navigate("/")}
        >
          Quay về trang chủ
        </Button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
