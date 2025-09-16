import multer from "multer";
import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import {
  deleteFile,
  downloadFile,
  getFileDetails,
  renameFile,
  renderFileRenameForm,
  renderFileUploadForm,
  uploadFile,
} from "../controllers/fileController.js";
import { validateFileRename, validateFileUpload } from "../lib/validators.js";

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

fileRouter.get("/:id", requireAuth, getFileDetails);

fileRouter.get("/:id/edit", requireAuth, renderFileRenameForm);

fileRouter.post("/:id/edit", requireAuth, validateFileRename, renameFile);

fileRouter.get("/:id/download", requireAuth, downloadFile);

fileRouter.post("/:id/delete", requireAuth, deleteFile);

export default fileRouter;
