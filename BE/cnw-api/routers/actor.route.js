import express from "express";
import {
    getActors,
    getActorByName,
    getActorById,
    getActorRole,
    addActor,
    addActorRole,
    deleteActor,
    deleteActorRole,
    updateActor,
    updateActorRole,
    findRoleByName,
    getactorbyid,
    getMoviesByActor
} from "../controllers/actor.controller.js";

const router = express.Router();



router.get("/", getActors);
router.get("/name/:name", getActorByName);
router.get("/id/:id", getactorbyid);
router.get("/moviesbyactor/:id", getMoviesByActor);
router.get("/actorby/:type/:id", getActorById);


router.get("/role/find/:actorId/:name", findRoleByName);
router.get("/role/:type/:id", getActorRole);
router.post("/role/:type", addActorRole);
router.put("/role/:type/:movieId", updateActorRole);
router.delete("/role/:type/:movieId", deleteActorRole);

router.post("/", addActor);
router.put("/:id", updateActor);
router.delete("/:id", deleteActor);

export default router;