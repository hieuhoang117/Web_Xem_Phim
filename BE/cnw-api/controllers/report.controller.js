import { sql } from "../db.js";

export const getMostViewedMovies = async (req, res) => {
    try {
        const result = await sql.query`SELECT 
    m.IDmovie,
    m.NameMovie, 
    COUNT(v.ID) AS Views,
    ISNULL(SUM(v.WatchTime), 0) AS TotalWatchTime
FROM Movie m
LEFT JOIN MovieView v ON m.IDmovie = v.IDmovie
GROUP BY m.IDmovie, m.NameMovie
ORDER BY Views DESC`;

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

export const getMostActiveUsers = async (req, res) => {
    try {
        const result = await sql.query`SELECT u.FullName, COUNT(v.ID) AS Views
FROM Users u
LEFT JOIN MovieView v ON u.UserID = v.UserID
GROUP BY u.FullName
ORDER BY Views DESC`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
export const getSignUpTrends = async (req, res) => {
    try {
        const result = await sql.query`SELECT 
    FORMAT(CreatedAt, 'yyyy-MM') AS Thang,
    COUNT(*) AS SoLuongUser
FROM Users
WHERE CreatedAt >= DATEADD(MONTH, -2, GETDATE())
GROUP BY FORMAT(CreatedAt, 'yyyy-MM')
ORDER BY Thang`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
export const GetBugReport = async (req, res) => {
    try {
        const result = await sql.query`
      SELECT 
        b.BugID,
        b.UserID,
        b.ContentID,
        b.Title,
        b.Description,
        b.BugType,
        b.Status,
        b.CreatedAt,
        b.UpdatedAt,
        u.FullName
      FROM BugReport b
      JOIN Users u ON b.UserID = u.UserID
      ORDER BY b.CreatedAt DESC
    `;

        res.status(200).json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
export const fixBugReport = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        await sql.query`
      UPDATE BugReport SET
      UpdatedAt = GETDATE(),
        Status = ${data.Status}
        WHERE BugID = ${id}
    `;
        res.json({ message: "Bug report updated successfully" });
    } catch (error) {
        console.error("Error updating bug report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const addBugReport = async (req, res) => {
    try {
        const { UserID, ContentID, Title, Description, BugType } = req.body;
        await sql.query`
      INSERT INTO BugReport (UserID, ContentID, Title, Description, BugType, Status, CreatedAt)
      VALUES (${UserID}, ${ContentID}, ${Title}, ${Description}, ${BugType}, 'Open', GETDATE())
    `;
        res.json({ message: "Bug report added successfully" });
    } catch (error) {
        console.error("Error adding bug report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
