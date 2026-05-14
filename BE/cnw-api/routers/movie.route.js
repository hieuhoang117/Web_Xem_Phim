import express from "express";
import { getMovies, addMovie,fixMovie,deleteMovie,getMovieByName,getTopMovie,deleteMovieView,isAddedToWatchlist,
    getMovieSeriesByCategory,getMovieById,getNewMovie,getCommingSoonMovie,addMovieView,getMovieSeriesByName,getmoviebycontentid,
    getMovieById2
 } from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/name/:name", getMovieByName);
router.post("/", addMovie);
router.put("/:id", fixMovie);
router.delete("/:id", deleteMovie);
router.get("/category/:category", getMovieSeriesByCategory);
router.get("/id/:id", getMovieById);
router.get("/top", getTopMovie);
router.get("/new", getNewMovie);
router.get("/commingsoon", getCommingSoonMovie);
router.post("/:id/view", addMovieView);
router.get("/search/:name", getMovieSeriesByName);
router.delete("/views/:userId/:movieId", deleteMovieView);
router.get("/views/:userId/:movieId", isAddedToWatchlist);
router.get("/content/:contentId", getmoviebycontentid);
router.get("/all/:id", getMovieById2);
export default router;