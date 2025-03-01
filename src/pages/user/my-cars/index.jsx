import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/features/counterSlice";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

function MyCars() {
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const user = useSelector(selectUser);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

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
      title: "Gói hiện tại",
      dataIndex: "package",
      key: "package",
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary">Thay đổi</Button>
          <Popconfirm
            title="Xóa"
            description="Bạn có chắc là muốn xóa xe này không?"
            onConfirm={() => handleDeleteCar(id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleDeleteCar = async (id) => {
    console.log(id);
    try {
      const res = await api.delete(`/cars/${id}`);
      if (!res.data.errorCode) {
        const listCarAfterDelete = dataSource.filter((car) => car._id != id);
        setDataSource(listCarAfterDelete);
        toast.success("Xóa xe thành công");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitForm = async (value) => {
    try {
      const res = await api.post("/cars", value);
      console.log(res);
      if (!res.data.errorCode) {
        setDataSource([...dataSource, res.data]);
        form.resetFields();
        setIsModalOpen(false);
        toast.success("Tạo xe mới thành công");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCarByUserId = async () => {
    try {
      const res = await api.get("/cars/my-cars");
      if (!res.data.errorCode) {
        setDataSource(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCarByUserId();
  }, []);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        Thêm xe mới
      </Button>

      <Table dataSource={dataSource} columns={columns} />
      <Modal
        title="Thêm xe mới"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
          <FormItem
            label="Hãng xe"
            name="brand"
            rules={[
              {
                required: true,
                message: "Hãng xe không được để trống",
              },
            ]}
          >
            {/* <Input /> */}
            <Select
              options={[
                { label: "Toyota", value: "Toyota" },
                { label: "Honda", value: "Honda" },
                { label: "Mazda", value: "Mazda" },
                { label: "Audi", value: "Audi" },
                { label: "Mercedes-Benz", value: "Mercedes-Benz" },
              ]}
            />
          </FormItem>
          <FormItem
            label="Dòng xe"
            name="model"
            rules={[
              {
                required: true,
                message: "Dòng xe không được để trống",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Màu xe"
            name="color"
            rules={[
              {
                required: true,
                message: "Màu xe không được để trống",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Số lượng chỗ ngồi"
            name="numberOfSeats"
            rules={[
              {
                required: true,
                message: "Số lượng chỗ ngồi không được để trống",
              },
              {
                pattern: /^[0-9]{1,2}$/,
                message: "Số lượng chỗ ngồi chỉ được nhập tối đa 2 chữ số",
              },
            ]}
          >
            <Input maxLength={2} />
          </FormItem>

          <FormItem
            label="Biển số xe"
            name="licensePlate"
            rules={[
              {
                required: true,
                message: "Biển số xe không được để trống",
              },
            ]}
          >
            <Input />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default MyCars;
