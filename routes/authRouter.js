import { Router } from "express";
const authRouter = Router();
import * as authController from "../controllers/authController.js";

authRouter.post("/log-in", authController.logIn);
authRouter.post("/sign-up", authController.signUp);
authRouter.get("/me", authController.me);

export default authRouter;
