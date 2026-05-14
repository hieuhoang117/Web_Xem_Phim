import { Table, Button, Input, Space, Form, Select, Modal, DatePicker, Upload } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const AM_series = () => {
    const [series, setSeries] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const { Option } = Select;
    const [selectedSeriesId, setSelectedSeriesId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSeries, setEditingSeries] = useState(null);
    const [editingEpisode, setEditingEpisode] = useState(null);
    const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState("");

    const [formSeries] = Form.useForm();
    const [formEpisode] = Form.useForm();
    const fetchSeries = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/series");
            const data = await res.json();
            setSeries(data);
        } catch (error) {
            console.error("Error fetching series:", error);
        }
    };
    const handleepisodefromseries = async (seriesId) => {
        try {
            if (!seriesId) {
                return;
            }
            const res = await fetch(`http://localhost:5000/api/series/episodes/series/${seriesId}`);
            const data = await res.json();
            setEpisodes(data);
        } catch (error) {
            console.error("Error fetching episodes:", error);
        }
    };


    useEffect(() => {
        fetchSeries();
    }, []);
    const handleFinserie = async (name) => {
        try {
            if (!name) {
                fetchSeries();
                return;
            }

            const res = await fetch(
                `http://localhost:5000/api/series/name/${name}`
            );
            const data = await res.json();
            setSeries(data);
        } catch (err) {
            console.error(err);
        }
    };
    const handleFinseriebyid = async (id) => {
        try {
            if (!id) {
                fetchSeries();
                return;
            }

            const res = await fetch(
                `http://localhost:5000/api/series/all/${id}`
            );
            const data = await res.json();
            setSeries(data);
        } catch (err) {
            console.error(err);
        }
    };
    const columns = [
        { title: "ID", dataIndex: "IDseries" },
        { title: "Tên series", dataIndex: "SeriesName" },
        { title: "Mô tả", dataIndex: "Description" },
        {
            title: "Năm phát hành", dataIndex: "ReleaseYear",
            render: (text) => text ? text.split("T")[0] : ""
        },
        { title: "Quốc gia", dataIndex: "Country" },
        {
            title: "Trạng thái",
            dataIndex: "Status",
            render: (text) => (text ? "Đang chiếu" : "Ngưng")
        },
        { title: "Thể loại", dataIndex: "Category" },
        { title: "Content ID", dataIndex: "ContentID" },
        {
            title: "Poster",
            dataIndex: "poster",
            render: (url) => url && <img src={url} alt="" width={80} />,
        },
        {
            title: "Action", render: (record) => (
                <Space>
                    <Button onClick={() => {
                        setEditingSeries(record);

                        formSeries.setFieldsValue({
                            ...record,
                            ReleaseYear: record.ReleaseYear
                                ? record.ReleaseYear.split("T")[0]
                                : null
                        });

                        setIsModalOpen(true);
                    }}>
                        Sửa
                    </Button>
                    <Button danger onClick={() => handleDeleteSeries(record.IDseries)}>
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];
    const columnsepisodes = [
        { title: "ID", dataIndex: "IDEpisode" },
        { title: "Tên tập", dataIndex: "EpisodeName" },
        { title: "Mô tả", dataIndex: "EpisodeDescription" },
        { title: "Thumbnail", dataIndex: "ThumbnailURL", render: (url) => url && <img src={url} alt="" width={80} /> },
        { title: "Mùa", dataIndex: "SeasonNumber" },
        { title: "Số tập", dataIndex: "EpisodeNumber" },
        { title: "Thời lượng", dataIndex: "Duration" },
        {
            title: "Ngày phát hành", dataIndex: "ReleaseDate",
            render: (text) => text ? text.split("T")[0] : ""
        },
        {
            title: "Link phim",
            dataIndex: "film",
            render: (value) => {
                if (!value) {
                    return <span style={{ color: "gray" }}>Không có</span>;
                }

                return (
                    <Button onClick={() => {
                        setCurrentVideo(value);
                        setIsVideoModalOpen(true);
                    }}>
                        Xem
                    </Button>
                );
            }
        },
        {
            title: "Action", render: (record) => (
                <Space>


                    <Button onClick={() => {
                        setEditingEpisode(record);

                        formEpisode.setFieldsValue({
                            ...record,
                            EpisodeNumber: Number(record.EpisodeNumber),
                            SeasonNumber: Number(record.SeasonNumber),
                            Duration: Number(record.Duration),
                            ReleaseDate: record.ReleaseDate ? dayjs(record.ReleaseDate) : null
                        });

                        setIsEpisodeModalOpen(true);
                    }}>
                        Sửa
                    </Button>
                    <Button danger onClick={() => handleDeleteepisode(record.IDEpisode)}>
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];
    const handleDeleteepisode = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/series/episodes/${id}`, { method: "DELETE" });
            handleepisodefromseries(selectedSeriesId);
        } catch (err) {
            console.error(err);
        }
    };
    const handleFinEpisode = async (name) => {
        try {
            if (!name) {
                handleepisodefromseries(selectedSeriesId);
                return;
            }

            const res = await fetch(
                `http://localhost:5000/api/series/episodes/find/${selectedSeriesId}/${name}`
            );

            const data = await res.json();
            setEpisodes(data);
        } catch (err) {
            console.error(err);
        }
    };
    const handleFinEpisodebyID = async (id) => {
        try {
            if (!id) {
                handleepisodefromseries(selectedSeriesId);
                return;
            }

            const res = await fetch(
                `http://localhost:5000/api/series/episodes/all/${selectedSeriesId}/${id}`
            );

            const data = await res.json();
            setEpisodes(data);
        } catch (err) {
            console.error(err);
        }
    };
    const handleDeleteSeries = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/series/${id}`, { method: "DELETE" });
            fetchSeries();
        } catch (err) {
            console.error(err);
        }
    };
    const handleOk = async () => {
        try {
            const values = await formSeries.validateFields();

            if (editingSeries) {

                await fetch(`http://localhost:5000/api/series/${editingSeries.IDseries}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values)
                });
            } else {

                await fetch("http://localhost:5000/api/series/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values)
                });
            }

            setIsModalOpen(false);
            formSeries.resetFields();
            fetchSeries();

        } catch (err) {
            console.log(err);
        }
    };
    const handleokepisode = async () => {
        try {
            const values = await formEpisode.validateFields();

            const payload = {
                ...editingEpisode,
                ...values,
                IDseries: editingEpisode
                    ? editingEpisode.IDseries
                    : selectedSeriesId,
                ReleaseDate: values.ReleaseDate
                    ? values.ReleaseDate.format("YYYY-MM-DD")
                    : null
            };

            if (editingEpisode) {
                await fetch(`http://localhost:5000/api/series/episodes/${editingEpisode.IDEpisode}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch("http://localhost:5000/api/series/episodes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            setIsEpisodeModalOpen(false);
            formEpisode.resetFields();
            handleepisodefromseries(selectedSeriesId);
        } catch (err) {
            console.log(err);
        }
    };
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
            <h2>Danh sách series</h2>
            <Button type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => {
                    setEditingSeries(null);
                    formSeries.resetFields();
                    setIsModalOpen(true);
                }}>
                Thêm series
            </Button>
            <Input placeholder="Tìm kiếm theo tên series" style={{ marginBottom: 16, width: 300 }}
                onChange={(e) => handleFinserie(e.target.value)}
            />
            <Input placeholder="Tìm kiếm theo ID" style={{ marginBottom: 16, width: 300 }}
                onChange={(e) => handleFinseriebyid(e.target.value)}
             />
            <Table dataSource={series} onRow={(record) => ({
                onClick: () => {
                    setSelectedSeriesId(record.IDseries);
                    handleepisodefromseries(record.IDseries);
                }
            })} columns={columns} rowKey="IDseries" pagination={{ pageSize: 5 }} />
            <h2>Danh sách tập phim</h2>
            <Button
                type="primary"
                onClick={() => {
                    if (!selectedSeriesId) {
                        alert("Vui lòng chọn series trước!");
                        return;
                    }
                    formEpisode.resetFields();
                    setIsEpisodeModalOpen(true);
                }}
            >
                Thêm tập phim
            </Button>
            <Input onChange={(e) => handleFinEpisode(e.target.value)} placeholder="Tìm kiếm theo tên tập phim" style={{ marginBottom: 16, width: 300 }} />
            <Input onChange={(e) => handleFinEpisodebyID(e.target.value)} placeholder="Tìm kiếm theo ID tập phim" style={{ marginBottom: 16, width: 300 }} />
            <Table dataSource={episodes} columns={columnsepisodes} rowKey="IDEpisode" pagination={{ pageSize: 5 }} />
            <Modal
                title={editingSeries ? "Sửa series" : "Thêm series"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
            >
                <Form form={formSeries} layout="vertical">
                    <Form.Item
                        name="SeriesName"
                        label="Tên series"
                        rules={[{ required: true, message: "Vui lòng nhập tên series" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="Description"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="ReleaseYear"
                        label="Năm phát hành"
                        rules={[{ required: true, message: "Vui lòng nhập năm phát hành" }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        name="Country"
                        label="Quốc gia"
                        rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="Status"
                        label="Trạng thái">
                        <Select>
                            <Option value={true}>Đang chiếu</Option>
                            <Option value={false}>Ngưng chiếu</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="Category"
                        label="Thể loại"
                        rules={[{ required: true, message: "Vui lòng nhập thể loại" }]}
                    >
                        <select>{catalog.map((item) => <option>{item}</option>)}</select>
                    </Form.Item>



                    <Form.Item label="Poster">
                        <Upload
                            action="http://localhost:5000/api/upload"
                            listType="picture"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === "done") {
                                    formSeries.setFieldsValue({ poster: info.file.response.url });
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="poster" hidden><input /></Form.Item>
                </Form>
            </Modal>
            <Modal
                title={editingEpisode ? "Sửa tập phim" : "Thêm tập phim"}
                open={isEpisodeModalOpen}
                onOk={handleokepisode}
                onCancel={() => setIsEpisodeModalOpen(false)}
                okText="Lưu"
            >
                <Form form={formEpisode} layout="vertical">
                    <Form.Item
                        name="EpisodeName"
                        label="Tên tập phim"
                        rules={[{ required: true, message: "Vui lòng nhập tên tập phim" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="SeasonNumber"
                        label="Mùa"
                        rules={[{ required: true, message: "Vui lòng nhập mùa" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="EpisodeDescription"
                        label="Mô tả tập phim"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả tập phim" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Thumbnail">
                        <Upload
                            action="http://localhost:5000/api/upload"
                            listType="picture"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === "done") {
                                    formEpisode.setFieldsValue({ ThumbnailURL: info.file.response.url });
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="EpisodeNumber"
                        label="Số tập"
                        rules={[{ required: true, message: "Vui lòng nhập số tập" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="Duration"
                        label="Thời lượng (phút)"
                        rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="ReleaseDate"
                        label="Ngày phát hành"
                        rules={[{ required: true, message: "Vui lòng nhập ngày phát hành" }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="film"
                        label="Link phim"
                        rules={[{ required: true, message: "Vui lòng nhập link phim" }]}
                    >
                        <Upload
                            action="http://localhost:5000/api/upload"
                            listType="text"
                            accept="video/mp4"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === "done") {
                                    formEpisode.setFieldsValue({
                                        film: info.file.response.url
                                    });
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload video</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="ThumbnailURL" hidden><input /></Form.Item>
                </Form>
            </Modal>
            <Modal
                open={isVideoModalOpen}
                onCancel={() => setIsVideoModalOpen(false)}
                footer={null}
                width={600}
            >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <video
                        key={currentVideo}
                        width="100%"
                        style={{ maxHeight: "400px", objectFit: "contain" }}
                        controls
                    >
                        <source src={currentVideo} type="video/mp4" />
                    </video>
                </div>
            </Modal>
        </div>

    );
}
export default AM_series;