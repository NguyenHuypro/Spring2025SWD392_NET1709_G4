import { Button, Image, Modal, Popconfirm, Table, Select } from "antd";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

export default function BookingManagement() {
  const [dataSource, setDataSource] = useState([]);
  const [rescuers, setRescuers] = useState([]);
  const [selectedRescuers, setSelectedRescuers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      if (!res.data.errorCode) {
        setDataSource(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAvailableRescuers = async () => {
    try {
      const res = await api.get("/users/available-rescuers");
      if (!res.data.errorCode) {
        setRescuers(res.data);
        setIsModalOpen(true); // Mở modal sau khi lấy dữ liệu
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAssignClick = (booking) => {
    setSelectedBooking(booking);
    fetchAvailableRescuers();
  };

  const handleAssignRescuers = async () => {
    if (selectedRescuers.length !== 2) {
      toast.error("Bạn phải chọn đúng 2 nhân viên cứu hộ!");
      return;
    }

    try {
      await api.put(`/bookings/${selectedBooking._id}/assign`, {
        staff1: selectedRescuers[0],
        staff2: selectedRescuers[1],
      });

      toast.success("Phân công nhân viên cứu hộ thành công!");
      fetchBookings();
      setIsModalOpen(false);
      setSelectedRescuers([]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Nhân viên cứu hộ 1",
      dataIndex: "staff1",
      key: "staff1",
      render: (user) => user?.fullName,
    },
    {
      title: "Nhân viên cứu hộ 2",
      dataIndex: "staff2",
      key: "staff2",
      render: (user) => user?.fullName,
    },
    {
      title: "Hình ảnh",
      dataIndex: "evidence",
      key: "evidence",
      render: (image) => (
        <Image
          src={image}
          style={{ width: 200 }}
          placeholder="day la hinh anh"
        />
      ),
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Thao tác",
      render: (value, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Chi tiết</Button>
          {value.status === "PENDING" ? (
            <>
              <Popconfirm
                title="Xóa"
                description="Bạn có chắc là muốn từ chối booking này không?"
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Từ chối</Button>
              </Popconfirm>
              <Button onClick={() => handleAssignClick(record)}>
                Phân công
              </Button>
            </>
          ) : (
            <></>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={dataSource} columns={columns} />

      {/* Modal Phân công */}
      <Modal
        title="Phân công nhân viên cứu hộ"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedRescuers([]);
        }}
        onOk={handleAssignRescuers}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Vui lòng chọn đúng 2 nhân viên cứu hộ:</p>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Chọn nhân viên cứu hộ"
          value={selectedRescuers}
          onChange={setSelectedRescuers}
          maxTagCount={2}
        >
          {rescuers.map((rescuer) => (
            <Select.Option key={rescuer._id} value={rescuer._id}>
              {rescuer.fullName}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
}
