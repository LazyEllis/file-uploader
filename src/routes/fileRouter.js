import multer from "multer";
import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import {
  renderFileUploadForm,
  uploadFile,
} from "../controllers/fileController.js";
import { validateFileUpload } from "../lib/validators.js";

const fileRouter = Router();

const upload = multer({ dest: "./uploads" });

fileRouter.get("/new", requireAuth, renderFileUploadForm);

fileRouter.post(
  "/new",
  requireAuth,
  upload.single("file"),
  validateFileUpload,
  uploadFile,
);

export default fileRouter;
