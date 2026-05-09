import express from "express";
import { getActors,getActorByMovieId,addActor,deleteActor,updateActor } from "../controllers/actor.controller.js";

const router = express.Router();

router.get("/", getActors);
router.get("/movie/:id", getActorByMovieId);
router.post("/", addActor);
router.put("/:id", updateActor);
router.delete("/:id", deleteActor);

export default router;

