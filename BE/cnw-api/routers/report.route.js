import express from "express";
import {getMostViewedMovies,getMostActiveUsers,getSignUpTrends,GetBugReport,fixBugReport,addBugReport} from "../controllers/report.controller.js";
const router = express.Router();


router.get("/most-viewed", getMostViewedMovies);
router.get("/most-active", getMostActiveUsers);
router.get("/sign-up-trends", getSignUpTrends);
router.get("/bug-reports", GetBugReport);
router.post("/bug-reports/:id/fix", fixBugReport);
router.post("/bug-reports", addBugReport);
export default router;