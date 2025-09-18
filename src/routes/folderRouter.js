import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { validateFolder } from "../lib/validators.js";
import {
  createFolder,
  deleteFolder,
  renderCreateFolderForm,
  renderFolderPage,
  renderUpdateFolderForm,
  updateFolder,
} from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/new", requireAuth, renderCreateFolderForm);

folderRouter.post("/new", requireAuth, validateFolder, createFolder);

folderRouter.get("/:id", requireAuth, renderFolderPage);

folderRouter.get("/:id/edit", requireAuth, renderUpdateFolderForm);

folderRouter.post("/:id/edit", requireAuth, validateFolder, updateFolder);

folderRouter.post("/:id/delete", requireAuth, deleteFolder);

export default folderRouter;
