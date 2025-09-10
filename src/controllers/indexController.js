export const renderSignUpForm = (req, res) => {
  res.render("auth-form", { mode: "sign-up" });
};

export const renderSignInForm = (req, res) => {
  res.render("auth-form", { mode: "sign-in" });
};
