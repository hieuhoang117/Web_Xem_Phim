import e from "cors";
import nodemailer from "nodemailer";
import { sql } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const checkEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await sql.query`
      SELECT Email, Role ,UserID
      FROM Users 
      WHERE Email = ${email} AND PasswordHash = ${password}
    `;

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      const token = jwt.sign(
        { userId: user.UserID, role: user.Role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        exists: true,
        role: user.Role,
        userId: user.UserID,
        token
      });
    } else {
      return res.json({ exists: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ exists: false, message: "Lỗi server" });
  }
};
export const getUsers = async (req, res) => {
  const result = await sql.query("SELECT * FROM Users");
  res.json(result.recordset);
};

export const addUser = async (req, res) => {
  try {
    const { UserID
      , FullName
      , Email
      , PasswordHash
      , Phone
      , Role
      , CreatedAt
      , Status } = req.body;

    await sql.query`
      INSERT INTO Users (UserID, FullName, Email, PasswordHash, Phone, Role, CreatedAt, Status)
      VALUES (${UserID}, ${FullName}, ${Email}, ${PasswordHash}, ${Phone}, ${Role}, ${CreatedAt}, ${Status})
    `;

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await sql.query`
      DELETE FROM Users WHERE UserID = ${id}
    `;
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fixUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    await sql.query`
      UPDATE Users SET
        FullName = ${data.FullName},
        Email = ${data.Email},
        PasswordHash = ${data.PasswordHash},
        Phone = ${data.Phone},
        Role = ${data.Role},
        Status = ${data.Status}
      WHERE UserID = ${id}
    `;
    res.json({ message: "User updated successfully" });
  }
  catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    const result = await sql.query`
      SELECT * FROM Users 
      WHERE Email LIKE '%' + ${email} + '%'
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const getMovieSeriesWatchedByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const result = await sql.query` 
      SELECT *
FROM (
  SELECT 
    m.IDmovie,
    NULL AS IDseries,
    m.NameMovie,
    NULL AS SeriesName,
    m.Category,
    m.ReleaseDate,
    m.Director,
    m.Duration,
    m.Country,
    m.Description,
    m.Status,
    m.Poster,
    m.Film,
    MAX(mv.ViewDate) AS LastWatch,
    'Movie' AS Type
  FROM MovieView mv
  JOIN Movie m ON mv.IDmovie = m.IDmovie
  WHERE mv.UserID = ${userId}
  GROUP BY 
    m.IDmovie, m.NameMovie, m.Category, m.ReleaseDate,
    m.Director, m.Duration, m.Country,
    m.Description, m.Status, m.Poster, m.Film

  UNION ALL

  SELECT 
    NULL AS IDmovie,
    s.IDseries,
    NULL AS NameMovie,
    s.SeriesName,
    s.Category,
    s.ReleaseYear AS ReleaseDate,
    NULL AS Director,
    NULL AS Duration,
    s.Country,
    s.Description,
    s.Status,
    s.poster AS Poster,
    NULL AS Film,
    MAX(ev.ViewDate) AS LastWatch,
    'Series' AS Type
  FROM EpisodeView ev
  JOIN Episode e ON ev.IDEpisode = e.IDEpisode
  JOIN Series s ON e.IDseries = s.IDseries
  WHERE ev.UserID = ${userId}
  GROUP BY 
    s.IDseries, s.SeriesName, s.Category,
    s.ReleaseYear, s.Country,
    s.Description, s.Status, s.poster
) AS WatchedContent
ORDER BY LastWatch DESC
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hieuhoangminh2403@gmail.com",
    pass: "ivnwnzecntiexcbi"
  }
});

const otpStore = {};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      expire: Date.now() + 60 * 1000
    };

    await transporter.sendMail({
      from: "hieuhoangminh2403@gmail.com",
      to: email,
      subject: "Mã xác nhận",
      text: `OTP của bạn là: ${otp}`
    });

    res.json({ message: "Đã gửi OTP" });

  } catch (err) {
    console.error("Lỗi gửi mail:", err);
    res.status(500).json({ message: "Không gửi được OTP" });
  }
};

export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore[email];

  if (!data) {
    return res.status(400).json({ message: "Chưa gửi OTP" });
  }

  if (Date.now() > data.expire) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP hết hạn" });
  }

  if (data.otp != otp) {
    return res.status(400).json({ message: "OTP sai" });
  }

  delete otpStore[email];

  return res.json({ success: true });
};

export const checkEmailNew = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await sql.query`
      SELECT 1 FROM Users WHERE Email = ${email}
    `;

    if (result.recordset.length > 0) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getUserbyId = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await sql.query`SELECT * FROM Users WHERE UserID = ${id}`;
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.params.id; // lấy từ URL
    const { oldPassword, newPassword } = req.body;

    const result = await sql.query`
      UPDATE Users
      SET PasswordHash = ${newPassword}
      WHERE UserID = ${userId} AND PasswordHash = ${oldPassword}
    `;

    res.json({ success: result.rowsAffected[0] > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const changeEmail = async (req, res) => {
  try {
    const userId = req.params.id;
    const { newEmail } = req.body;

    const result = await sql.query`
          UPDATE Users
          SET Email = ${newEmail}
          WHERE UserID = ${userId}
        `;

    res.json({ success: result.rowsAffected[0] > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const result = await sql.query`
      UPDATE Users
      SET PasswordHash = ${newPassword}
      WHERE Email = ${email}
    `;

    res.json({ success: result.rowsAffected[0] > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const getUserByID2 = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await sql.query`
      SELECT * FROM Users 
      WHERE UserID = ${id}
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};