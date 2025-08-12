import express from "express";
import passport from "./auth/passport.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
import sessionMiddleware from "./auth/sessionMiddleware.js";
import cors from "cors";

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

import apiRouter from "./routes/apiRouter.js";

app.use(sessionMiddleware);
app.use(passport.session());

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json("No resource found");
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json(err.message || "Error 500: Internal Server Error");
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log(`App started at port: ${PORT}`);
});
