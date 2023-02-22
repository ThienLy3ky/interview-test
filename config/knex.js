require("dotenv").config({ path: "./.env" });
const knex = require("knex")({
  client: process.env.DIA_DB,
  connection: {
    post: process.env.PORT_DB,
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PWD_DB,
    database: process.env.NAME_DB,
  },
  pool: { min: 0, max: 7 },
});
knex
  .raw("SELECT VERSION()")
  .then(() => {
    console.log("Database connection success");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = knex;
