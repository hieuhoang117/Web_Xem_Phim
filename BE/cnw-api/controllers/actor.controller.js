import { sql } from "../db.js";

export const getActors = async (req, res) => {
    const result = await sql.query("SELECT * FROM Actor");
    res.json(result.recordset);
};
export const getActorByMovieId = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sql.query`SELECT m.IDactor, a.ActorName,a.Nationality,a.BirthDate,a.Descriptionn,m.RoleName FROM MovieActor m left join Actor a on m.IDactor = a.IDactor WHERE IDmovie = ${id}`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}
export const addActor = async (req, res) => {
    try {
        const { ActorName, Nationality, BirthDate, Descriptionn } = req.body;
        const result = await sql.query`INSERT INTO Actor (ActorName, Nationality, BirthDate, Descriptionn) VALUES (${ActorName}, ${Nationality}, ${BirthDate}, ${Descriptionn})`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}
export const deleteActor = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sql.query`DELETE FROM Actor WHERE IDactor = ${id}`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}
export const updateActor = async (req, res) => {
    try {
        const id = req.params.id;
        const { ActorName, Nationality, BirthDate, Descriptionn } = req.body;
        const result = await sql.query`UPDATE Actor SET ActorName = ${ActorName}, Nationality = ${Nationality}, BirthDate = ${BirthDate}, Descriptionn = ${Descriptionn} WHERE IDactor = ${id}`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}