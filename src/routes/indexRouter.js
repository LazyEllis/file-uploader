import { Router } from "express";
import passport from "passport";
import { requireGuest } from "../lib/auth.js";
import { validateSignIn, validateSignUp } from "../lib/validators.js";
import {
  renderSignInForm,
  renderSignUpForm,
  signUp,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/sign-up", requireGuest, renderSignUpForm);

indexRouter.post("/sign-up", requireGuest, validateSignUp, signUp);

indexRouter.get("/sign-in", requireGuest, renderSignInForm);

indexRouter.post(
  "/sign-in",
  requireGuest,
  validateSignIn,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
    failureMessage: true,
  }),
);

export default indexRouter;
