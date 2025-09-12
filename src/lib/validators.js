import { body, validationResult } from "express-validator";
import prisma from "./prisma.js";

const validate = (validators, view, options = {}) => [
  validators,
  async (req, res, next) => {
    const { id } = req.params;
    const errors = validationResult(req);
    let folders;

    if (view === "folder-form" && id) {
      folders = await prisma.folder.findMany({
        where: { userId: Number(req.user.id), id: { not: Number(id) } },
      });
    } else if (view === "folder-form" || view === "file-form") {
      folders = await prisma.folder.findMany({
        where: { userId: Number(req.user.id) },
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).render(view, {
        ...options,
        folders,
        data: { ...req.body, id },
        errors: errors.array(),
      });
    }

    next();
  },
];

const checkFolderExists = async (value, { req }) => {
  const { id } = req.user;

  const folder = await prisma.folder.findUnique({ where: { id: value } });

  if (!folder) {
    throw new Error("The selected folder does not exist.");
  }

  if (folder.userId !== id) {
    throw new Error(
      "You do not have permission to modify the selected folder.",
    );
  }
};

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

export const validateFolder = validate(
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("You must enter the folder's name."),
    body("parentId")
      .default(null)
      .toInt()
      .isInt()
      .withMessage("You must select a valid folder option.")
      .bail()
      .custom(checkFolderExists)
      .bail()
      .custom(async (value, { req }) => {
        const { id } = req.params;

        const folder = await prisma.folder.findUnique({ where: { id: value } });

        if (folder.id === Number(id)) {
          throw new Error("A folder cannot be set as its own parent.");
        }
      })
      .optional({ values: "null" }),
  ],
  "folder-form",
);
