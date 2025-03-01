import { Button, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import { changeCurr } from "../../../utils/utils";

export default function Package() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState();
  const [selectedCar, setSelectedCar] = useState([]);
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
      dataIndex: "services",
      render: (value) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setCurrentPackage(value);
              setIsModalOpen(true);
            }}
            style={{ marginRight: 20 }}
          >
            Chi tiết các dịch vụ
          </Button>
          <Button>Mua gói</Button>
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
        setDataSource(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
      <Modal open={isModalOpen} onCancel={handleCloseModal} title="Dịch vụ">
        <Table dataSource={currentPackage} columns={serviceColumns} />
      </Modal>
    </div>
  );
}
