import e from "cors";
import { sql } from "../db.js";

export const getNotifix = async (req, res) => {
    try {
        const result = await sql.query`
        SELECT * FROM Notification
    `;

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getNotificationByCreateAndActive = async (req, res) => {
    try {
        const result = await sql.query`
        SELECT * FROM Notification
        WHERE IsActive = 1 AND ExpiredAt > GETDATE()
    `;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createNotifix = async (req, res) => {
    try {
        const { Title, Message, ImageURL, ExpiredAt, IsActive, ContentID } = req.body;

        if (!Title || !Message) {
            return res.status(400).json({ error: "Thiếu dữ liệu" });
        }

        const active = IsActive ?? true;
        const expired = ExpiredAt ? new Date(ExpiredAt) : null;
        const content = ContentID || null;

        await sql.query`
      INSERT INTO Notification (Title, Message, ImageURL, ExpiredAt, IsActive, ContentID)
      VALUES (${Title}, ${Message}, ${ImageURL}, ${expired}, ${active}, ${content})
    `;

        res.json({ message: "Tạo thông báo thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const updateNotifix = async (req, res) => {
    try {
        const id = req.params.id;
        const { Title, Message, ImageURL, ExpiredAt, IsActive, ContentID } = req.body;

        const active = IsActive ?? true;
        const expired = ExpiredAt || null;

        const result = await sql.query`
          UPDATE Notification SET
            Title = ${Title},   
            Message = ${Message},
            ImageURL = ${ImageURL},
            ExpiredAt = ${expired},
            IsActive = ${active},
            ContentID = ${ContentID}
          WHERE NotificationID = ${id}
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông báo" });
        }

        res.json({ message: "Notification updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const deleteNotifix = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await sql.query`
          DELETE FROM Notification WHERE NotificationID = ${id}
        `;

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy thông báo" });
        }

        res.json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const searchNotifix = async (req, res) => {
    const title = req.params.name;

    try {
        const result = await sql.query`
      SELECT * FROM Notification
      WHERE Title LIKE ${'%' + title + '%'}
    `;

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getcontentNotifix = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                c.ContentID,
                c.ContentName,
                c.ContentType,
                m.Poster,
                m.IDmovie
            FROM Content c
            LEFT JOIN Movie m ON c.ContentID = m.ContentID
            WHERE c.ContentType = 'Movie'
        `;

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const movieseriesfromNotifix = async (req, res) => {
    const contentID = req.params.id;

    try {
        const result = await sql.query`
            SELECT 
                c.ContentID,
                c.ContentName,
                c.ContentType,
                m.IDmovie,
                s.IDseries
            FROM Content c
            LEFT JOIN Movie m ON c.ContentID = m.ContentID
            LEFT JOIN Series s ON c.ContentID = s.ContentID
            WHERE c.ContentID = ${contentID}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy nội dung" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getcontentmovieseriesfromNotifix = async (req, res) => {
    try {
        const result = await sql.query`
            SELECT 
                c.ContentID,
                c.ContentName,
                c.ContentType,
                m.IDmovie,
                s.IDseries
            FROM Content c
            LEFT JOIN Movie m ON c.ContentID = m.ContentID
            LEFT JOIN Series s ON c.ContentID = s.ContentID
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};