import express from "express";
import {
    getActors,
    getActorByName,
    getActorByMovieId,
    getActorRole,
    addActor,
    addActorRole,
    deleteActor,
    deleteActorRole,
    updateActor,
    updateActorRole,
    findRoleByName
} from "../controllers/actor.controller.js";

const router = express.Router();


router.get("/", getActors);
router.get("/name/:name", getActorByName);       
router.get("/movie/:id", getActorByMovieId);
router.post("/", addActor);
router.put("/:id", updateActor);
router.delete("/:id", deleteActor);


router.get("/role/:id", getActorRole);
router.get("/role/find/:actorId/:name", findRoleByName); 
router.post("/role/", addActorRole);
router.put("/role/:movieId", updateActorRole);
router.delete("/role/:movieId", deleteActorRole);

export default router;