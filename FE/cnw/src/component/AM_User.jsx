import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Select } from "antd";

const { Option } = Select;

const AM_User = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();


  const fetchuser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      fetchuser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinUser = async (email) => {
    try {
      if (!email) {
        fetchuser();
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/users/email/${(email)}`
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };
   const handleFinUserbyID = async (id) => {
    try {
      if (!id) {
        fetchuser();
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/users/all/${(id)}`
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        await fetch(`http://localhost:5000/api/users/${editingUser.UserID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      } else {
        await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }

      setIsModalOpen(false);
      fetchuser();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "UserID" },
    { title: "Tên người dùng", dataIndex: "FullName" },
    { title: "Email", dataIndex: "Email" },
    {
      title: "Trạng thái",
      render: (value) => (value === true ? "Hoạt động" : "Ngưng hoạt động"),
      dataIndex: "Status"
    },
    { title: "Điện thoại", dataIndex: "Phone" },
    { title: "Vai trò", dataIndex: "Role" },
    { title: "Mật khẩu", dataIndex: "PasswordHash" },
    {
      title: "Trang thái",
      render: (value) => (value === true ? "Hoạt động" : "Ngưng hoạt động"),
      dataIndex: "Status",
    },
    { title: "Ngày tạo", dataIndex: "CreatedAt" },
    {
      title: "Hành động",
      render: (record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn xóa?"
            onConfirm={() => handleDelete(record.UserID)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý người dùng</h2>

      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        + Thêm người dùng
      </Button>
      <Input
        style={{ marginBottom: 15 }}
        placeholder="Tìm theo email..."
        onChange={(e) => handleFinUser(e.target.value)}
      />
      <Input
        style={{ marginBottom: 15 }}
        placeholder="Tìm theo ID..."
        onChange={(e) => handleFinUserbyID(e.target.value)}
        ></Input>

      <Table columns={columns} dataSource={users} rowKey="UserID" pagination={{ pageSize: 5 }} />

      <Modal
        title={editingUser ? "Sửa người dùng" : "Thêm người dùng"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="FullName" label="Tên người dùng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="Email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="PasswordHash" label="Mật khẩu" rules={[{ required: true }]}>
            <Input type="password" />
          </Form.Item>

          <Form.Item name="Phone" label="Điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="Role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Option value="User">Người dùng</Option>
              <Option value="Admin">Quản trị viên</Option>
            </Select>
          </Form.Item>

          <Form.Item name="Status" label="Trạng thái">
            <Select>
              <Option value={1}>Hoạt động</Option>
              <Option value={0}>Ngưng hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AM_User;