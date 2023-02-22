const express = require("express");
const router = express.Router();
const service = require("../service");
const validate = require("../service/validate");
const { expressjwt: jwt } = require("express-jwt");
/* GET home page. */
router.get(
  "/api",
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ["HS256"],
    credentialsRequired: false,
  }),
  function (req, res) {
    if (!req.auth.user) return res.status(401).send("unauthorized");
    res.status(200).send("authentication successfull");
    return;
  }
);
router.post("/sign-up", validate.validateRegisterUser(), service.Signup);
router.post("/sign-in", validate.validateRegisterUser(), service.login);
router.post("/sign-out", service.Signout);
router.post("/refresh-token", service.refreshToken);

module.exports = router;
