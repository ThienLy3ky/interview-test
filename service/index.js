const db = require("../config/knex");
const jwt = require("express-jwt");
const bcrypt = require("bcrypt");
var { validationResult } = require("express-validator");
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const data = await db
        .select()
        .table("users")
        .where({ email: email })
        .first();
      console.log(data);
      if (data) {
        const checkPassword = await bcrypt.compare(password, data.password);
        if (checkPassword) {
          const tokenUser = jwt({
            secret: "my-secret",
            requestProperty: "auth",
            credentialsRequired: true,
            getToken: function (req) {
              if (req.headers["x-auth-token"]) {
                return req.headers["x-auth-token"];
              }
              return null;
            },
          });
          res.status(200).send(tokenUser);
          return;
        }
        res.status(400).send("password is incorrect");
        return;
      }
      res.status(400).send("email is invalid");
      return;
    }
    res.status(401).send("nohave");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.Signup = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json(
      errors?.errors?.map((error) => {
        return error.msg;
      })
    );
    return;
  }
  try {
    if (email && password) {
      const id = await db
        .insert({
          email,
          password: bcrypt.hashSync(password, 10),
          firstName,
          lastName,
        })
        .into("users");
      res.status(201).send({
        id,
        email,
        displayName: firstName + lastName,
        firstName,
        lastName,
      });
      return;
    }
    res.status(400).send("nohave");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.Signout = async (req, res, next) => {
  try {
    db.delete().table("tokens");
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
