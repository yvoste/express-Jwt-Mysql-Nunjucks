
module.exports = app => {
  const auth = require("../middleware/auth")
  const authRefresh = require("../middleware/authRefresh")
  const express = require('express')
  const router = express.Router()
  const user = require("../controllers/controller_users")

  router.post("/signup", user.signup);
  router.post("/signin", user.signin)
  router.post("/update/", auth, authRefresh, user.update)
  router.get("/profil/", auth, authRefresh, user.profil)
  router.get("/logout/", auth, authRefresh, user.logout)

  app.use('/api/user', router);
};