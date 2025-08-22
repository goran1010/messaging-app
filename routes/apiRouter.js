import { Router } from "express";
const apiRouter = Router();
import * as apiController from "../controllers/apiController.js";
import isLoggedIn from "../auth/isLoggedIn.js";

apiRouter.get("/", apiController.check);
apiRouter.put("/add-friend", isLoggedIn, apiController.addFriend);

export default apiRouter;
