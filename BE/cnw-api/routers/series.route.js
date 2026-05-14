import express from "express";
import { getSeries,getEpisodesBySeriesId,addSeries,getTopSeries,
    deleteSeries,updateSeries,finseries,addEpisode,getseriesByid,getEpisodeById,addSeriesView,deleteSeriesView,isAddedToWatchlist,
deleteEpisode,findEpisode,updateEpisode,finseriesbyID,findEpisodebyID } from "../controllers/series.controller.js";
const router = express.Router();

router.get("/", getSeries);
router.get("/top", getTopSeries);
router.get("/episodes/series/:id", getEpisodesBySeriesId);
router.post("/", addSeries);
router.put("/:id", updateSeries);
router.get("/name/:name", finseries);
router.delete("/:id", deleteSeries);
router.post("/views", addSeriesView);
router.delete("/views/:userId/:episodeId", deleteSeriesView);
router.get("/views/:userId/:episodeId", isAddedToWatchlist);
router.post("/episodes", addEpisode);
router.delete("/episodes/:id", deleteEpisode);
router.get("/episodes/find/:seriesId/:name", findEpisode);
router.get("/episodes/:id", getEpisodeById);
router.get("/series/:seriesId", getseriesByid);
router.put("/episodes/:id", updateEpisode);
router.get("/all/:id", finseriesbyID);
router.get("/episodes/all/:seriesId/:name", findEpisodebyID);

export default router;