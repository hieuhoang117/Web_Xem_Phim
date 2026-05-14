import express from "express";
import { checkEmail,getUsers,addUser,deleteUser,fixUser,getUserByEmail,getMovieSeriesWatchedByUser,
    sendOTP,verifyOTP,checkEmailNew ,getUserbyId,changeEmail,changePassword,resetPassword,getUserByID2
 } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/check-email", checkEmail);
router.get("/", getUsers);
router.get("/email/:email", getUserByEmail);
router.post("/", addUser);
router.delete("/:id", deleteUser);
router.put("/:id", fixUser);
router.get("/:id/watched", getMovieSeriesWatchedByUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/check-email-new", checkEmailNew);
router.get("/id/:id", getUserbyId);
router.put("/change-email/:id", changeEmail);
router.put("/change-password/:id", changePassword);
router.post("/reset-password", resetPassword);
router.get("/all/:id", getUserByID2);

export default router;