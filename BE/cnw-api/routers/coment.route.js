import express from "express";
import {
    getComentById,
    getNewComments,
    addComent,
    deleteComent,
    createSession,
    endSession,
    getAllSession,
    getSessionbyID
} from "../controllers/coment.controller.js";

const router = express.Router();

router.get("/", getComentById);          // load ban đầu
router.get("/new/:sessionId/:lastTime", getNewComments);     // polling
router.post("/", addComent);
router.delete("/:id", deleteComent);

router.post("/session", createSession);
router.post("/session/end", endSession);
router.get("/session/:id", getAllSession);
router.get("/session/id/:sessionId", getSessionbyID);

export default router;