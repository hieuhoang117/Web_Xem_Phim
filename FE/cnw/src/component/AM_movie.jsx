import { Table, Button, Space, Modal, Form, Input, Popconfirm, Upload, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const { Option } = Select;

const AM_movie = () => {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();


  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/movies");
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);


  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/movies/${id}`, { method: "DELETE" });
      fetchMovies();
    } catch (err) {
      console.error(err);
    }
  };


  const handleEdit = (record) => {
    setEditingMovie(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };


  const handleAdd = () => {
    setEditingMovie(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  const handleFinmovie = async (name) => {
    try {
      if (!name) {
        fetchMovies();
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/movies/name/${name}`
      );
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error(err);
    }
  };


  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingMovie) {

        await fetch(`http://localhost:5000/api/movies/${editingMovie.IDmovie}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      } else {
        // ADD
        await fetch("http://localhost:5000/api/movies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
      }

      setIsModalOpen(false);
      fetchMovies();
    } catch (err) {
      console.error(err);
    }
  };


  const columns = [
    { title: "ID", dataIndex: "IDmovie", },
    { title: "Tên phim", dataIndex: "NameMovie" },
    { title: "Thể loại", dataIndex: "Category" },
    { title: "Thời lượng", dataIndex: "Duration" },
    { title: "Quốc gia", dataIndex: "Country" },
    { title: "Đạo diễn", dataIndex: "Director" },
    {
      title: "Ngày phát hành", dataIndex: "ReleaseDate",
      render: (text) => text ? text.split("T")[0] : ""
    },
    { title: "Mô tả", dataIndex: "Description" },
    { title: "Content ID", dataIndex: "ContentID" },
    {
      title: "Poster",
      dataIndex: "Poster",
      render: (url) => url && <img src={url} alt="" width={80} />,
    }, {
      title: "Trạng thái",
      render: (value) => (value === true ? "Đang chiếu" : "Ngưng Chiếu"),
      dataIndex: "Status"
    },
    {
      title: "Action",
      render: (record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn chắc chắn xóa?"
            onConfirm={() => handleDelete(record.IDmovie)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const catalog = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Sci-fi",
    "Fantasy",
    "Horror",
    "Romance",
    "Thriller",
    "Western",
  ];

  return (
    <div>
      <h2>Quản lý phim</h2>

      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        + Thêm phim
      </Button>
      <Input
        style={{ marginBottom: 15 }}
        placeholder="Tìm theo tên phim..."
        onChange={(e) => handleFinmovie(e.target.value)}
      />

      <Table columns={columns} dataSource={movies} rowKey="IDmovie" pagination={{ pageSize: 5 }} />


      <Modal
        title={editingMovie ? "Sửa phim" : "Thêm phim"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="NameMovie"
            label="Tên phim"
            rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Category"
            label="Thể loại"
            rules={[{ required: true, message: "Vui lòng nhập thể loại" }]}
          >
            <select>
              {catalog.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Form.Item>

          <Form.Item
            name="ReleaseDate"
            label="Ngày phát hành"
            rules={[{ required: true, message: "Vui lòng nhập ngày phát hành" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="Director"
            label="Đạo diễn"
            rules={[{ required: true, message: "Vui lòng nhập đạo diễn" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Duration"
            label="Thời lượng"
            rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Country"
            label="Quốc gia"
            rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="Status"
            label="Trạng thái">
            <Select>
              <Option value={true}>Đang chiếu</Option>
              <Option value={false}>Ngưng chiếu</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Poster">
            <Upload
              action="http://localhost:5000/api/upload"
              listType="picture"
              maxCount={1}
              onChange={(info) => {
                if (info.file.status === "done") {
                  form.setFieldsValue({ Poster: info.file.response.url });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Film">
            <Upload
              action="http://localhost:5000/api/upload"
              maxCount={1}
              onChange={(info) => {
                if (info.file.status === "done") {
                  form.setFieldsValue({ Film: info.file.response.url });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload video</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="Poster" hidden><input /></Form.Item>
          <Form.Item name="Film" hidden><input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AM_movie;