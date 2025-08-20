import { Router } from "express";
const authRouter = Router();
import * as authController from "../controllers/authController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

authRouter.post("/log-in", authController.logIn);
authRouter.post("/sign-up", authController.signUp);
authRouter.put(
  "/update-profile",
  upload.single("image"),
  authController.updateProfile,
);
authRouter.get("/me", authController.me);

export default authRouter;
