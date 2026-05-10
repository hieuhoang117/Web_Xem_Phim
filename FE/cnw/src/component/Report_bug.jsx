import { Form, Modal, Select, Input } from "antd";
import { useState } from "react";
import "./Report_bug.css";

const ReportBug = ({ ContentID, UserID }) => {
    const [form] = Form.useForm();
    const [isopen, setIsOpen] = useState(false);

    const handleReport = async (title, description, bugType) => {
        try {
            const res = await fetch("http://localhost:5000/api/reports/bug-reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    UserID,
                    ContentID,
                    Title: title,
                    Description: description,
                    BugType: bugType,
                }),
            });

            if (res.ok) {
                console.log("Bug report submitted successfully");
            } else {
                console.error("Failed to submit bug report");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        form.resetFields();
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleSubmit = (values) => {
        handleReport(values.title, values.description, values.bugType);
        setIsOpen(false);
        form.resetFields();
    };

    return (
        <div className="report-bug">
            <button onClick={handleOpen}>Báo cáo</button>
            <Modal
                title="Báo cáo"
                open={isopen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleSubmit}>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                        <Input placeholder="Nhập tiêu đề..." />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} placeholder="Mô tả chi tiết..." />
                    </Form.Item>
                    <Form.Item name="bugType" label="Loại" rules={[{ required: true }]}>
                        <Select
                            placeholder="Chọn loại báo cáo"
                            options={[
                                { value: "bug", label: "Lỗi kỹ thuật" },
                                { value: "feature", label: "Tính năng" },
                                { value: "performance", label: "Video" },
                                { value: "other", label: "Khác" },
                            ]}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ReportBug