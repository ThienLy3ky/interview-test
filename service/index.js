const db = require("../config/knex");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var { validationResult } = require("express-validator");
const generrateToken = (data, secretKey, expires) => {
  return jwt.sign(
    {
      user: data,
    },
    secretKey,
    {
      expiresIn: expires,
    }
  );
};
const validate = (errors) => {
  if (!errors.isEmpty()) {
    return errors?.errors?.map((error) => {
      return error.msg;
    });
    return false;
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  //Begin Throw validation
  if (validate(errors)) {
    res.status(400).json(validate(errors));
    return;
  }
  //End Throw validation
  try {
    if (email && password) {
      // Get information about user from database
      const data = await db
        .select()
        .table("Users")
        .where({ email: email })
        .first();
      if (data) {
        const checkPassword = await bcrypt.compare(password, data.password);
        let dataRes = {
          email: data.email,
          displayName: data.firstName + data.lastName,
          firstName: data.firstName,
          lastName: data.lastName,
        };
        if (checkPassword) {
          if (checkPassword) {
            //Begin Generate a token
            const tokenUser = generrateToken(
              {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
              },
              process.env.SECRET_KEY,
              "1h"
            );
            //End Generate a token
            // Begin Generate a fresh token
            const tokenRefresh = generrateToken(
              { email: data.email },
              process.env.SECRET_KEY_REFRESH,
              "30d"
            );
            // End Generate a fresh token
            let date = new Date();
            date = date.setDate(date.getDate() + 30);
            // Begin save token to database
            const update = await db("Tokens")
              .update({ refreshToken: tokenRefresh })
              .where({ userId: data.id });
            if (update === 0) {
              await db
                .insert({
                  refreshToken: tokenRefresh,
                  userId: data.id,
                  expiresIn: date,
                })
                .into("Tokens");
            }
            // End save token to database
            res.status(200).send({
              user: dataRes,
              token: tokenUser,
              refreshToken: tokenRefresh,
            });
            return;
          }
        }
        res.status(400).send("password is incorrect");
        return;
      }
      res.status(400).send("email is incorrect");
      return;
    }
    res.status(400).send("Email or password is incorrect");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.Signup = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  const errors = validationResult(req);
  //Begin Throw validation
  if (validate(errors)) {
    res.status(400).json(validate(errors));
    return;
  }
  //End Throw validation
  try {
    if (email && password) {
      const checkEmail = await db
        .select()
        .table("Users")
        .where({ email: email })
        .first();
      if (checkEmail) {
        res.status(400).send("email is not available for the signup");
        return;
      }
      // Begin create user
      const id = await db
        .insert({
          email,
          password: bcrypt.hashSync(password, 10),
          firstName,
          lastName,
        })
        .into("Users");
      // End create user
      res.status(201).send({
        id,
        email,
        displayName: firstName + lastName,
        firstName,
        lastName,
      });
      return;
    }
    res.status(400).send("Email or password is incorrect");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.Signout = async (req, res, next) => {
  try {
    db.delete().table("Tokens");
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    // Get information about user from database
    const user = await db
      .select()
      .table("Tokens")
      .join("Users", "Users.id", "Tokens.userId")
      .where({ refreshToken: refreshToken })
      .first();
    if (user) {
      let tokenRefresh = refreshToken;
      // Begin generate new token
      const tokenUser = generrateToken(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        process.env.SECRET_KEY,
        "1h"
      );
      // End generate token
      // Check if refresh token is expired then generate new refresh token
      if (new Date().getTime() >= user.expiresIn) {
        tokenRefresh = generrateToken(
          { email: data.email },
          process.env.SECRET_KEY_REFRESH,
          "30d"
        );
        let date = new Date();
        date.setDate(date.getDate() + 30);
        await db("Tokens")
          .update({ refreshToken: tokenRefresh, expiresIn: date })
          .where({ userId: data.id });
      }
      // Check if refresh token is expired then generate new refresh token
      res.status(200).send({
        token: tokenUser,
        refreshToken: tokenRefresh,
      });
      return;
    }
    res.status(400).send("refreshToken in the inbound exists");
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
