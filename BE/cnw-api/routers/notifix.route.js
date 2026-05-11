import express from "express";
import{getNotifix, createNotifix, updateNotifix, deleteNotifix,searchNotifix,getNotificationByCreateAndActive,getcontentNotifix,
    movieseriesfromNotifix,getcontentmovieseriesfromNotifix
} from "../controllers/notifix.controller.js";

const router = express.Router();

router.get("/", getNotifix);
router.get("/name/:name", searchNotifix);
router.get("/active", getNotificationByCreateAndActive);
router.get("/content", getcontentNotifix);
router.get("/content/:id", movieseriesfromNotifix);
router.post("/", createNotifix);
router.put("/:id", updateNotifix);
router.delete("/:id", deleteNotifix);
router.get("/contentmovieseries", getcontentmovieseriesfromNotifix);
export default router;