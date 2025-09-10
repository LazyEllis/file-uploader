import { body, validationResult } from "express-validator";
import prisma from "./prisma.js";

const validate = (validators, view, options = {}) => [
  validators,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render(view, {
        ...options,
        data: { ...req.body },
        errors: errors.array(),
      });
    }

    next();
  },
];

export const validateSignUp = validate(
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("You must enter your username")
      .isAlphanumeric("en-US", { ignore: "_.-" })
      .withMessage(
        "Your username must only contain letters, numbers, underscores, periods and hyphens.",
      )
      .bail()
      .custom(async (value) => {
        const user = await prisma.user.findUnique({
          where: { username: value },
        });

        if (user) {
          throw new Error("This username is already in use.");
        }
      }),
    body("password")
      .isStrongPassword()
      .withMessage(
        "Your password must have at least 8 characters containing at least a lowercase and uppercase letter, a number and a symbol.",
      ),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("The passwords must match."),
  ],
  "auth-form",
  { mode: "sign-up" },
);

export const validateSignIn = validate(
  [
    body("username", "You must enter your username.").notEmpty(),
    body("password", "You must enter your password.").notEmpty(),
  ],
  "auth-form",
  { mode: "sign-in" },
);
