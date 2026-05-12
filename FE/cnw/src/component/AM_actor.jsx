import { Table, Button, Input, Space, Form, Modal, Upload, Select } from "antd";
import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";

const AM_actor = () => {
    const [actors, setActors] = useState([]);
    const [actorRoles, setActorRoles] = useState([]);
    const [selectedActorId, setSelectedActorId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingActor, setEditingActor] = useState(null);
    const [editingRole, setEditingRole] = useState(null);
    

    const [formActor] = Form.useForm();
    const [formRole] = Form.useForm();

    // ─── Fetch ───────────────────────────────────────────────
    const fetchActors = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/actor/");
            const data = await res.json();
            setActors(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRolesByActor = async (actorId) => {
        if (!actorId) return;
        try {
            const res = await fetch(`http://localhost:5000/api/actor/role/${actorId}`);
            const data = await res.json();
            setActorRoles(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchActors();
    }, []);

    // ─── Search ───────────────────────────────────────────────
    const handleFindActor = async (name) => {
        try {
            if (!name) { fetchActors(); return; }
            const res = await fetch(`http://localhost:5000/api/actor/name/${name}`);
            const data = await res.json();
            setActors(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFindRole = async (name) => {
        try {
            if (!name) { fetchRolesByActor(selectedActorId); return; }
            const res = await fetch(`http://localhost:5000/api/actor/role/find/${selectedActorId}/${name}`);
            const data = await res.json();
            setActorRoles(data);
        } catch (err) {
            console.error(err);
        }
    };

    // ─── Delete ───────────────────────────────────────────────
    const handleDeleteActor = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/actor/${id}`, { method: "DELETE" });
            fetchActors();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteRole = async (record) => {
        try {
            await fetch(`http://localhost:5000/api/actor/role/${record.type}/${record.IDmovie}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ IDactor: selectedActorId })
            });
            fetchRolesByActor(selectedActorId);
        } catch (err) {
            console.error(err);
        }
    };

    // ─── Save Actor ───────────────────────────────────────────
    const handleOkActor = async () => {
        try {
            const values = await formActor.validateFields();

            if (editingActor) {
                await fetch(`http://localhost:5000/api/actor/${editingActor.IDactor}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values)
                });
            } else {
                await fetch("http://localhost:5000/api/actor/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values)
                });
            }

            setIsModalOpen(false);
            formActor.resetFields();
            fetchActors();
        } catch (err) {
            console.error(err);
        }
    };

    // ─── Save Role ────────────────────────────────────────────
    const handleOkRole = async () => {
        try {
            const values = await formRole.validateFields();
            const { type, IDmovie, RoleName } = values;
            const payload = { IDactor: selectedActorId, IDmovie, RoleName };

            if (editingRole) {
                await fetch(`http://localhost:5000/api/actor/role/${type}/${IDmovie}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                await fetch(`http://localhost:5000/api/actor/role/${type}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            setIsRoleModalOpen(false);
            formRole.resetFields();
            fetchRolesByActor(selectedActorId);
        } catch (err) {
            console.error(err);
        }
    };

    // ─── Columns ──────────────────────────────────────────────
    const columnsActor = [
        { title: "ID", dataIndex: "IDactor" },
        { title: "Tên diễn viên", dataIndex: "ActorName" },
        {
            title: "Ảnh",
            dataIndex: "Photo",
            render: (url) => url && <img src={url} alt="" width={60} style={{ borderRadius: 4 }} />
        },
        { title: "Ngày sinh", dataIndex: "BirthDate", render: (text) => text ? text.split("T")[0] : "" },
        { title: "Mô tả", dataIndex: "Descriptionn" },
        { title: "Quốc tịch", dataIndex: "Nationality" },
        {
            title: "Action",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => {
                        setEditingActor(record);
                        formActor.setFieldsValue({
                            ...record,
                            BirthDate: record.BirthDate ? record.BirthDate.split("T")[0] : null
                        });
                        setIsModalOpen(true);
                    }}>Sửa</Button>
                    <Button danger onClick={() => handleDeleteActor(record.IDactor)}>Xóa</Button>
                </Space>
            )
        }
    ];

    const columnsRole = [
        { title: "ID Phim", dataIndex: "SourceId" },
        { title: "Vai diễn", dataIndex: "RoleName" },
        {
            title: "Action",
            render: (_, record) => (
                <Space>
                    <Button onClick={() => {
                        setEditingRole(record);
                        formRole.setFieldsValue(record);
                        setIsRoleModalOpen(true);
                    }}>Sửa</Button>
                    <Button danger onClick={() => handleDeleteRole(record)}>Xóa</Button>
                </Space>
            )
        }
    ];

    // ─── Render ───────────────────────────────────────────────
    return (
        <div>
            <h2>Danh sách diễn viên</h2>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => {
                    setEditingActor(null);
                    formActor.resetFields();
                    setIsModalOpen(true);
                }}
            >
                Thêm diễn viên
            </Button>
            <Input
                placeholder="Tìm kiếm theo tên diễn viên"
                style={{ marginBottom: 16, width: 300 }}
                onChange={(e) => handleFindActor(e.target.value)}
            />
            <Table
                dataSource={actors}
                columns={columnsActor}
                rowKey="IDactor"
                pagination={{ pageSize: 5 }}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedActorId(record.IDactor);
                        fetchRolesByActor(record.IDactor);
                    }
                })}
            />

            <h2>Vai diễn</h2>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => {
                    if (!selectedActorId) { alert("Vui lòng chọn diễn viên trước!"); return; }
                    setEditingRole(null);
                    formRole.resetFields();
                    setIsRoleModalOpen(true);
                }}
            >
                Thêm vai diễn
            </Button>
            <Input
                placeholder="Tìm kiếm theo tên vai diễn"
                style={{ marginBottom: 16, width: 300 }}
                onChange={(e) => handleFindRole(e.target.value)}
            />
            <Table
                dataSource={actorRoles}
                columns={columnsRole}
                rowKey="IDmovie"
                pagination={{ pageSize: 5 }}
            />

            {/* Modal Actor */}
            <Modal
                title={editingActor ? "Sửa diễn viên" : "Thêm diễn viên"}
                open={isModalOpen}
                onOk={handleOkActor}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
            >
                <Form form={formActor} layout="vertical">
                    <Form.Item name="ActorName" label="Tên diễn viên" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="BirthDate" label="Ngày sinh">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="Nationality" label="Quốc tịch">
                        <Input />
                    </Form.Item>
                    <Form.Item name="Descriptionn" label="Mô tả">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Ảnh đại diện">
                        <Upload
                            action="http://localhost:5000/api/upload"
                            listType="picture"
                            maxCount={1}
                            onChange={(info) => {
                                if (info.file.status === "done") {
                                    formActor.setFieldsValue({ Photo: info.file.response.url });
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload ảnh</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="Photo" hidden><input /></Form.Item>
                </Form>
            </Modal>

            {/* Modal Role */}
            <Modal
                title={editingRole ? "Sửa vai diễn" : "Thêm vai diễn"}
                open={isRoleModalOpen}
                onOk={handleOkRole}
                onCancel={() => setIsRoleModalOpen(false)}
                okText="Lưu"
            >
                <Form form={formRole} layout="vertical">
                    <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="movie">Phim</Select.Option>
                            <Select.Option value="series">Series</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="IDmovie" label="ID Phim/Series" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="RoleName" label="Vai diễn" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AM_actor;