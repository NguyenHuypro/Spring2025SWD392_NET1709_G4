import { Button, Modal, Table, Radio } from "antd";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { changeCurr } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";

export default function Package() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const [currentPackage, setCurrentPackage] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);

  const navigate = useNavigate();

  const columns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (value) => changeCurr(value),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setCurrentPackage(record);
              setIsModalOpen(true);
            }}
            style={{ marginRight: 20 }}
          >
            Chi tiết
          </Button>
          <Button
            onClick={() => {
              setCurrentPackage(record);
              setIsModal2Open(true);
            }}
          >
            Mua gói
          </Button>
        </>
      ),
    },
  ];

  const serviceColumns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => changeCurr(price),
    },
  ];

  const fetchPackages = async () => {
    try {
      const res = await api.get("/packages");
      if (!res.data.errorCode) {
        setDataSource(res.data.result);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCarByUserId = async () => {
    try {
      const res = await api.get("/cars/my-cars");
      if (!res.data.errorCode) {
        setCars(res.data.result);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách xe.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModal2Open(false);
    setSelectedCar(null);
  };

  const handleCarChange = (e) => {
    setSelectedCar(e.target.value);
  };

  const handleBuyPackage = () => {
    if (!selectedCar || !currentPackage) {
      toast.error("Vui lòng chọn xe trước khi tiếp tục.");
      return;
    }

    navigate(`/checkout?packageId=${currentPackage.id}&car=${selectedCar}`);
  };

  useEffect(() => {
    fetchPackages();
    fetchCarByUserId();
  }, []);

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />

      {/* Modal Chi Tiết Gói */}
      <Modal open={isModalOpen} onCancel={handleCloseModal} title="Dịch vụ">
        <Table
          dataSource={currentPackage?.services || []}
          columns={serviceColumns}
        />
      </Modal>

      {/* Modal Chọn Xe */}
      <Modal
        open={isModal2Open}
        title="Chọn xe"
        onOk={handleBuyPackage}
        onCancel={handleCloseModal}
        okButtonProps={{ disabled: !selectedCar }}
      >
        <Radio.Group onChange={handleCarChange} value={selectedCar}>
          {cars.map((car) => (
            <Radio
              key={car.id}
              value={car.id}
              style={{ display: "block", marginBottom: "10px" }}
            >
              {car.brand} {car.model} ({car.licensePlate})
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </div>
  );
}
