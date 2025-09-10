import { Router } from "express";
import passport from "passport";
import { requireAuth, requireGuest } from "../lib/auth.js";
import { validateSignIn, validateSignUp } from "../lib/validators.js";
import {
  renderSignInForm,
  renderSignUpForm,
  signOut,
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

indexRouter.get("/sign-out", requireAuth, signOut);

export default indexRouter;
