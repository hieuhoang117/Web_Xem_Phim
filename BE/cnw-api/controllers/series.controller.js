import e from "cors";
import { sql } from "../db.js";
export const getSeries = async (req, res) => {
  try {
    const result = await sql.query(`
            SELECT 
                IDseries,
                SeriesName,
                Description,
                ReleaseYear,
                Country,
                Category,
                Status,
                ContentID,
                poster
            FROM Series
        `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const getEpisodesBySeriesId = async (req, res) => {
  try {
    const seriesId = req.params.id;
    const result = await sql.query`
      SELECT 
        e.IDEpisode,
        e.IDseries,
        e.EpisodeName,
        e.EpisodeNumber,
        e.SeasonNumber,
        e.Duration,
        e.film,
        e.ThumbnailURL,
        e.EpisodeDescription,
        s.poster,
        e.ReleaseDate,
        e.ContentID
      FROM Episode e LEFT JOIN Series s ON e.IDseries = s.IDseries
      WHERE s.IDseries = ${seriesId}
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const updateSeries = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    await sql.query`
      UPDATE Series
      SET 
        SeriesName = ${data.SeriesName},
        Description = ${data.Description},
        ReleaseYear = ${data.ReleaseYear},
        Category = ${data.Category},
        Country = ${data.Country},
        Status = ${data.Status},
        poster = ${data.poster}
      WHERE IDseries = ${id}
    `;

    res.send("Update thành công");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const finseries = async (req, res) => {
  try {
    const name = req.params.name;
    const result = await sql.query`
            SELECT 
                IDseries, 
                SeriesName,
                Description,
                ReleaseYear,  
                Country,
                Status,
                ContentID,
                poster,
                Category
            FROM Series
            WHERE SeriesName LIKE ${"%" + name + "%"}
        `;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const addSeries = async (req, res) => {
  try {
    const data = req.body;

    await sql.query`
      INSERT INTO Series (
        SeriesName, Description, ReleaseYear,
        Country, Status, poster, Category
      )
      VALUES (
        ${data.SeriesName},
        ${data.Description},
        ${data.ReleaseYear},
        ${data.Country},
        ${data.Status},
        ${data.poster},
        ${data.Category}
      )
    `;

    res.status(201).send("Series added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const deleteSeries = async (req, res) => {
  try {
    const id = req.params.id;
    await sql.query`
      DELETE FROM Series WHERE IDseries = ${id}
    `;
    res.send("Series deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const addEpisode = async (req, res) => {
  try {
    const data = req.body;
    await sql.query`
      INSERT INTO Episode (
        EpisodeName, EpisodeNumber, SeasonNumber,
        ContentID, Duration, IDseries, film, ReleaseDate,
        ThumbnailURL, EpisodeDescription
      )
      VALUES (
        ${data.EpisodeName},
        ${data.EpisodeNumber},
        ${data.SeasonNumber},
        ${data.ContentID},
        ${data.Duration},
        ${data.IDseries},
        ${data.film},
        ${data.ReleaseDate},
        ${data.ThumbnailURL},
        ${data.EpisodeDescription}
      )
    `;
    res.status(201).send("Episode added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const deleteEpisode = async (req, res) => {
  try {
    const id = req.params.id;
    await sql.query`
      DELETE FROM Episode WHERE IDEpisode = ${id}
    `;
    res.send("Episode deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const updateEpisode = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    await sql.query`
      UPDATE Episode
      SET
        EpisodeName = ${data.EpisodeName},
        EpisodeNumber = ${data.EpisodeNumber},
        SeasonNumber = ${data.SeasonNumber},  
        ContentID = ${data.ContentID},
        Duration = ${data.Duration},
        IDseries = ${data.IDseries},
        film = ${data.film},
        ReleaseDate = ${data.ReleaseDate},
        ThumbnailURL = ${data.ThumbnailURL},
        EpisodeDescription = ${data.EpisodeDescription}
      WHERE IDEpisode = ${id}
    `;
    res.send("Episode updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server  ");
  }
};
export const findEpisode = async (req, res) => {
  try {
    const { name, seriesId } = req.params;

    const result = await sql.query`
      SELECT 
        IDEpisode,
        EpisodeName,
        EpisodeNumber,
        SeasonNumber,
        ContentID,
        Duration,
        IDseries,
        film, 
        ThumbnailURL,
        EpisodeDescription,
        ReleaseDate
      FROM Episode
      WHERE EpisodeName LIKE ${"%" + name + "%"}
      AND IDseries = ${seriesId}
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const getseriesByid = async (req, res) => {
  try {
    const seriesId = req.params.seriesId;

    const result = await sql.query`
      SELECT  
        s.IDseries,
        s.SeriesName,
        s.Description,
        s.ReleaseYear,
        s.Country,
        s.Category,
        s.Status,
        s.ContentID,
        s.poster,
        e.IDEpisode,
        e.EpisodeName,  
        e.EpisodeNumber,
        e.SeasonNumber,
        e.Duration,
        e.film,
        e.ThumbnailURL,
        e.EpisodeDescription,
        e.ReleaseDate
      FROM Series s
      LEFT JOIN Episode e ON e.IDseries = s.IDseries
      WHERE s.IDseries = ${seriesId}
    `;

    const rows = result.recordset;

    if (rows.length === 0) {
      return res.json({ series: null, episodes: [] });
    }

    const series = {
      IDseries: rows[0].IDseries,
      SeriesName: rows[0].SeriesName,
      Description: rows[0].Description,
      ReleaseYear: rows[0].ReleaseYear,
      Category: rows[0].Category,
      Country: rows[0].Country,
      Status: rows[0].Status,
      ContentID: rows[0].ContentID,
      poster: rows[0].poster,
    };

    const episodes = rows
      .filter(row => row.IDEpisode)
      .map(row => ({
        IDEpisode: row.IDEpisode,
        EpisodeName: row.EpisodeName,
        EpisodeNumber: row.EpisodeNumber,
        SeasonNumber: row.SeasonNumber,
        Duration: row.Duration,
        film: row.film,
        ThumbnailURL: row.ThumbnailURL,
        EpisodeDescription: row.EpisodeDescription,
        ReleaseDate: row.ReleaseDate,
      }));

    res.json({ series, episodes });

  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const getEpisodeById = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await sql.query`
      SELECT 
        IDEpisode,
        IDseries,
        EpisodeName,
        EpisodeNumber,
        SeasonNumber,
        Duration,
        film,
        ThumbnailURL,
        EpisodeDescription,
        ReleaseDate
      FROM Episode
      WHERE IDEpisode = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Episode not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const getTopSeries = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT TOP 5 
          s.IDseries, 
          s.SeriesName,
          s.Description,
          s.Country,
          s.ReleaseYear,
          s.poster,
          s.Category,
          s.Status,
          COUNT(ev.ID) AS TotalViews
      FROM Series s
      JOIN Episode e ON s.IDseries = e.IDseries
      JOIN EpisodeView ev ON e.IDEpisode = ev.IDEpisode
      GROUP BY 
          s.IDseries, 
          s.SeriesName,
          s.Description,
          s.Country,
          s.ReleaseYear,
          s.poster,
          s.Category,
          s.Status
      ORDER BY TotalViews DESC
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const addSeriesView = async (req, res) => {
  try {
    const { userId, episodeId } = req.body;

    const check = await sql.query`
      SELECT * FROM EpisodeView
      WHERE UserID = ${userId} AND IDEpisode = ${episodeId}
    `;

    if (check.recordset.length > 0) {

      await sql.query`
        UPDATE EpisodeView
        SET ViewDate = GETDATE(),
            WatchTime = 0
        WHERE UserID = ${userId} AND IDEpisode = ${episodeId}
      `;
    } else {

      await sql.query`
        INSERT INTO EpisodeView (UserID, IDEpisode, ViewDate, WatchTime)
        VALUES (${userId}, ${episodeId}, GETDATE(), 0)
      `;
    }

    res.json({ message: "Đã cập nhật lịch sử xem series" });

  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const deleteSeriesView = async (req, res) => {
  try {
    const { userId, episodeId } = req.params;

    await sql.query`
      DELETE FROM EpisodeView
      WHERE UserID = ${userId} AND IDEpisode = ${episodeId}
    `;

    res.json({ message: "Đã xóa lịch sử xem series" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};
export const isAddedToWatchlist = async (req, res) => {
  try {
    const { userId, episodeId } = req.params;

    const result = await sql.query`
      SELECT * FROM EpisodeView
      WHERE UserID = ${userId} AND IDEpisode = ${episodeId}
    `;

    res.json({ isAdded: result.recordset.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi server");
  }
};