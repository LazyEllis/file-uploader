import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import {
  renderCreateFolderForm,
  renderUpdateFolderForm,
} from "../controllers/folderController.js";

const folderRouter = Router();

folderRouter.get("/new", requireAuth, renderCreateFolderForm);

folderRouter.get("/:id/edit", requireAuth, renderUpdateFolderForm);

export default folderRouter;
