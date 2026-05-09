import express from "express";
import cors from "cors";
import movieRoutes from "./routers/movie.route.js";
import userRoutes from "./routers/user.route.js";
import reportRoutes from "./routers/report.route.js";
import series from "./routers/series.route.js";
import notifix from "./routers/notifix.route.js";
import coment from "./routers/coment.route.js";
import actor from "./routers/actor.route.js";
import { connectDB } from "./db.js";
import multer from "multer";
import path from "path";


const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage });


app.post("/api/upload", upload.single("file"), (req, res) => {
  const url = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ url });
});


app.use("/uploads", express.static("uploads"));



app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/series", series);
app.use("/api/notifix", notifix);
app.use("/api/coment", coment);
app.use("/api/actor", actor);


app.listen(5000, '0.0.0.0', () => {
  console.log("Server chạy http://localhost:5000");
});