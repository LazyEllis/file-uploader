import { Router } from "express";
import {
  renderSignInForm,
  renderSignUpForm,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/sign-up", renderSignUpForm);

indexRouter.get("/sign-in", renderSignInForm);

export default indexRouter;
