export const requireGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).redirect("/sign-in");
  }

  next();
};
