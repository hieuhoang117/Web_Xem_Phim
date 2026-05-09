import { sql } from "../db.js";

export const getActors = async (req, res) => {
    const result = await sql.query("SELECT * FROM Actor");
    res.json(result.recordset);
};
export const getActorRole = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sql.query`SELECT * FROM MovieActor WHERE IDactor = ${id}`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
}
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
export const addActor = async (req, res) => {
    try {
        const { ActorName, Nationality, BirthDate, Descriptionn, Photo } = req.body;
        await sql.query`INSERT INTO Actor (ActorName, Nationality, BirthDate, Descriptionn, Photo) 
                        VALUES (${ActorName}, ${Nationality}, ${BirthDate}, ${Descriptionn}, ${Photo})`;
        res.json({ message: "Thêm diễn viên thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

export const updateActor = async (req, res) => {
    try {
        const id = req.params.id;
        const { ActorName, Nationality, BirthDate, Descriptionn, Photo } = req.body;
        await sql.query`UPDATE Actor 
                        SET ActorName = ${ActorName}, Nationality = ${Nationality}, 
                            BirthDate = ${BirthDate}, Descriptionn = ${Descriptionn}, Photo = ${Photo}
                        WHERE IDactor = ${id}`;
        res.json({ message: "Cập nhật thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};
export const getActorByName = async (req, res) => {
    try {
        const name = `%${req.params.name}%`;
        const result = await sql.query`SELECT * FROM Actor WHERE ActorName LIKE ${name}`;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

export const findRoleByName = async (req, res) => {
    try {
        const { actorId, name } = req.params;
        const likeName = `%${name}%`;
        const result = await sql.query`
            SELECT ma.IDmovie, m.NameMovie, ma.RoleName 
            FROM MovieActor ma
            LEFT JOIN Movie m ON ma.IDmovie = m.IDmovie
            WHERE ma.IDactor = ${actorId} AND ma.RoleName LIKE ${likeName}
        `;
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

export const addActorRole = async (req, res) => {
    try {
        const { IDactor, IDmovie, RoleName } = req.body;
        await sql.query`
            INSERT INTO MovieActor (IDmovie, IDactor, RoleName) 
            VALUES (${IDmovie}, ${IDactor}, ${RoleName})
        `;
        res.json({ message: "Thêm vai diễn thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

export const updateActorRole = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { IDactor, RoleName } = req.body;
        await sql.query`
            UPDATE MovieActor 
            SET RoleName = ${RoleName}
            WHERE IDmovie = ${movieId} AND IDactor = ${IDactor}
        `;
        res.json({ message: "Cập nhật vai diễn thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};

export const deleteActorRole = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { IDactor } = req.body;
        await sql.query`
            DELETE FROM MovieActor 
            WHERE IDmovie = ${movieId} AND IDactor = ${IDactor}
        `;
        res.json({ message: "Xóa vai diễn thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi server");
    }
};