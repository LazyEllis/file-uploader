import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

export const renderSignUpForm = (req, res) => {
  res.render("auth-form", { mode: "sign-up" });
};

export const signUp = async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  req.login(user, (error) => {
    if (error) {
      return next(error);
    }

    res.redirect("/");
  });
};

export const renderSignInForm = (req, res) => {
  const { messages } = req.session;

  const errors = messages ? [{ msg: messages[0] }] : undefined;

  if (messages) {
    req.session.messages = undefined;
  }

  res.render("auth-form", { mode: "sign-in", errors });
};
