const { check } = require("express-validator");
const validateRegisterUser = () => {
  return [
    check("email", "username does not Empty").not().isEmpty(),
    check("password", "username must be Alphanumeric").not().isEmpty(),
    check("email", "email must be email").isEmail(),
    check("password", "password more than 8 degits").isLength({ min: 8 }),
    check("password", "password less than 20 degits").isLength({ max: 20 }),
  ];
};

const validate = { validateRegisterUser };
module.exports = validate;
