import { Button, Form, Input, Modal, Popconfirm, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import { useEffect, useState } from "react";
import api from "../../../configs/axios";
import { toast } from "react-toastify";
import moment from "moment-timezone";

function MyCars() {
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCar, setSelectedCar] = useState({});

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
      render: (value) => {
        if (value?.name) return value?.name;
        return "Chưa mua gói";
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiredDate",
      key: "expiredDate",
      render: (value) => {
        if (value) {
          return moment(value).tz("Asia/Bangkok").format("DD-MM-YYYY");
        }
        return;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedCar(record);
              setIsUpdate(true);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            Thay đổi
          </Button>
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
        const listCarAfterDelete = dataSource.filter((car) => car.id != id);
        setDataSource(listCarAfterDelete);
        toast.success("Xóa xe thành công");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmitForm = async (value) => {
    console.log(value);
    try {
      if (isUpdate) {
        const res = await api.put(`/cars/${selectedCar.id}`, value);
        if (res.data.isSuccess) {
          setSelectedCar({});
          setIsUpdate(false);
          await fetchCarByUserId();
          setIsModalOpen(false);
        } else {
          toast.error(res.data.message);
        }
      } else {
        const res = await api.post("/cars", value);
        if (res.data.isSuccess) {
          setDataSource([...dataSource, res.data.result]);
          form.resetFields();
          setIsModalOpen(false);
          toast.success("Tạo xe mới thành công");
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCarByUserId = async () => {
    try {
      const res = await api.get("/cars/my-cars");
      console.log(res.data.result);
      if (res.data.isSuccess) {
        setDataSource(res.data.result);
      } else {
        toast.error(res.data.message);
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
        title={isUpdate ? "Thay đổi thông tin xe" : "Thêm xe mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => {
          console.log("??");
          form.submit();
        }}
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
            hidden={isUpdate ? true : false}
            rules={[
              {
                required: true,
                message: "Biển số xe không được để trống",
              },
              {
                pattern: /^[0-9]{2}[A-Z]-[0-9]{4,5}$/,
                message: "Biển số xe chưa đúng định dạng",
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
