import path from "path";
import express from "express";
import session from "express-session";
import passport from "passport";
import prisma from "./lib/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import "./lib/passport.js";
import "dotenv/config";
import indexRouter from "./routes/indexRouter.js";
import folderRouter from "./routes/folderRouter.js";

// A second is 1000 milliseconds
const ONE_DAY = 1000 * 60 * 60 * 24;
const TWENTY_MINUTES = 1000 * 60 * 20;

const app = express();

const assetsPath = path.join(import.meta.dirname, "public");

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: TWENTY_MINUTES,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    cookie: {
      maxAge: ONE_DAY,
    },
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(assetsPath));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/folders", folderRouter);
app.use("/", indexRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
