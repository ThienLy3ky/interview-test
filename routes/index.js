var express = require("express");
var router = express.Router();
const service = require("../service");
const validate = require("../service/validate");
/* GET home page. */
router.post("/sign-up", validate.validateRegisterUser(), service.Signup);
router.patch("/sign-in", service.login);
router.patch("/sign-out", service.Signout);
router.patch("/refresh-token", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
