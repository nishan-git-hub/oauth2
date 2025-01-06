import express from "express";
import session from "express-session";
import passport from "./oauth2/auth.js";

const app = express();
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

function isLoggedIn(req, res, next) {
  return req.user
    ? next()
    : res.status(401).json({
        message: "Unauthorized",
      });
}

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.status(500).json({
    message: "Something Went Wrong || You are not authenticated",
  });
});

app.get("/protected", isLoggedIn, (req, res) => {
  console.log(req.user);
  res.status(200).json({
    message: "You are visiting a protected route",
    username: `${req.user.displayName}`,
  });
});

app.get("/logout", (req, res) => {
  req.logout(() =>
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged Out Successfully" });
    })
  );
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
