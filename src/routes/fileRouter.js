import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { renderFileUploadForm } from "../controllers/fileController.js";

const fileRouter = Router();

fileRouter.get("/new", requireAuth, renderFileUploadForm);

export default fileRouter;
