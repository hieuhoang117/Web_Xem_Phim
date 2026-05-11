import { sql } from "../db.js";

// 🔹 Lấy comment ban đầu
export const getComentById = async (req, res) => {
    try {
        const { contentId, sessionId } = req.query;

        const result = await sql.query`
            SELECT TOP 100 c.*, u.FullName
            FROM Comment c
            JOIN Users u ON c.UserID = u.UserID
            WHERE c.ContentID = ${contentId}
            AND (${sessionId} IS NULL OR c.SessionID = ${sessionId})
            AND c.IsActive = 1
            ORDER BY c.CreatedAt DESC
        `;

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Lấy comment mới (polling)
export const getNewComments = async (req, res) => {
    try {
        const { sessionId, lastTime } = req.params;

        const time = new Date(lastTime);

        const result = await sql.query`
            SELECT c.*, u.FullName
            FROM Comment c
            JOIN Users u ON c.UserID = u.UserID
            WHERE c.SessionID = ${sessionId}
            AND c.CreatedAt > ${time}
            AND c.IsActive = 1
            ORDER BY c.CreatedAt ASC
        `;

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Thêm comment
export const addComent = async (req, res) => {
    try {
        const { contentId, userId, commentText, sessionId } = req.body;

        if (!contentId || !userId || !commentText) {
            return res.status(400).json({ message: "Thiếu dữ liệu" });
        }

        await sql.query`
            INSERT INTO Comment (ContentID, UserID, CommentText, SessionID)
            VALUES (${contentId}, ${userId}, ${commentText}, ${sessionId})
        `;

        res.json({ message: "Comment added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Xóa (ẩn)
export const deleteComent = async (req, res) => {
    try {
        const { id } = req.params;

        await sql.query`
            UPDATE Comment
            SET IsActive = 0
            WHERE CommentID = ${id}
        `;

        res.json({ message: "Comment hidden successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Lấy tất cả session đang live
export const getAllSession = async (req, res) => {
    const UserID = req.params.id;
    try {
        const result = await sql.query`
            SELECT 
                ws.SessionID,
                ws.StartTime,
                ws.IsLive,
                ws.ContentID,
                ws.UserID,
                ws.EndTime,
                c.ContentName,
                m.Poster
            FROM WatchSession ws
            JOIN Content c ON ws.ContentID = c.ContentID
            LEFT JOIN Movie m ON c.ContentID = m.ContentID
            WHERE ws.IsLive = 1 AND ws.UserID = ${UserID}
            ORDER BY ws.StartTime DESC
        `;

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Tạo session mới
export const createSession = async (req, res) => {
    try {
        const { contentId, UserID, EndTime, StartTime } = req.body;

        if (!contentId) {
            return res.status(400).json({ message: "ContentID is required" });
        }

        const sessionId = "SS" + Date.now();

        await sql.query`
            INSERT INTO WatchSession (SessionID, ContentID, StartTime,EndTime, IsLive,UserID)
            VALUES (${sessionId}, ${contentId}, ${StartTime}, ${EndTime}, 1, ${UserID})
        `;

        res.json({
            sessionId,
            message: "Session created successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔹 Kết thúc session
export const endSession = async (req, res) => {
    try {
        const { sessionId } = req.body;

        await sql.query`
            UPDATE WatchSession
            SET IsLive = 0, EndTime = GETDATE()
            WHERE SessionID = ${sessionId}
        `;

        await sql.query`
            UPDATE Comment
            SET IsActive = 0
            WHERE SessionID = ${sessionId}
        `;

        res.json({ message: "Session ended" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getSessionbyID = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const result = await sql.query`
            SELECT * FROM WatchSession WHERE SessionID = ${sessionId}
        `;
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getRandomSession = async (req, res) => {
    try {
        const {userId} = req.params;
        const result = await sql.query`
            SELECT TOP 9 * FROM WatchSession 
            WHERE IsLive = 1 AND UserID != ${userId}
            ORDER BY NEWID()
        `;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};