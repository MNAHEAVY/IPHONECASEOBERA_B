const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("./models/users"); // Asegúrate de ajustar la ruta al modelo

// Configuración JWT
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Usa una variable de entorno para el secreto
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Configuración Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            given_name: profile.name.givenName,
            family_name: profile.name.familyName,
            picture: profile.photos[0].value,
            sub: profile.id,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
