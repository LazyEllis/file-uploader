import { Router } from "express";
import { requireGuest } from "../lib/auth.js";
import {
  renderSignInForm,
  renderSignUpForm,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/sign-up", requireGuest, renderSignUpForm);

indexRouter.get("/sign-in", requireGuest, renderSignInForm);

export default indexRouter;
