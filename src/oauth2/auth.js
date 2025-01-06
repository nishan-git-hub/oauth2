import passport from "passport";
import passportGoogleOauth2 from "passport-google-oauth2";

import { ENV_VARS } from "./envVars.js";
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = ENV_VARS;

const GoogleStrategy = passportGoogleOauth2.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

export default passport;
