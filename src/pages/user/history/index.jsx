import { Button, Table } from "antd";

function History() {
  function changeCurr(value = 200000) {
    const formattedCurr = new Intl.NumberFormat("vi-VI", {
      style: "currency",
      currency: "VND",
    }).format(value);
    return formattedCurr;
  }
  //   const price = changeCurr(10000);
  const columns = [
    {
      title: "Thời điểm đặt lịch",
      dataIndex: "createdAt",
      key: "createdAt",
    },

    {
      title: "Thời điểm kết thúc",
      dataIndex: "completedAt",
      key: "completedAt",
    },
    {
      title: "Tình trạng",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      key: "price",
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
          <Button type="primary">Xem chi tiết</Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Table
        dataSource={[
          {
            createdAt: "15-02-2025",
            completedAt: "15-02-2025",
            description: "Xe bị bể bánh",
            numberOfSeats: 5,
            price: changeCurr(500000),
            licensePlate: "51L-12345",
          },
        ]}
        columns={columns}
      />
    </div>
  );
}

export default History;
