import { Button, Table } from "antd";
import { useForm } from "antd/es/form/Form";

function MyCars() {
  const [form] = useForm();

  const columns = [
    {
      title: "Hãng xe",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Dòng xe",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Màu xe",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Số lượng chỗ ngồi",
      dataIndex: "numberOfSeats",
      key: "numberOfSeats",
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Thao tác",
      key: "id",
      render: () => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Thay đổi</Button>
          <Button type="primary" danger>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary">Thêm xe mới</Button>

      <Table
        dataSource={[
          {
            brand: "Mercedes",
            model: "G63",
            color: "Đen",
            numberOfSeats: 5,
            licensePlate: "51L-12345",
          },
        ]}
        columns={columns}
      />
    </div>
  );
}

export default MyCars;
