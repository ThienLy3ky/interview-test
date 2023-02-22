// Update with your config settings.
const path = require("path");
require("dotenv").config({ path: "./.env" });
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: process.env.DIA_DB,
    connection: {
      host: process.env.HOST_DB,
      user: process.env.USER_DB,
      password: process.env.PWD_DB,
      database: process.env.NAME_DB,
      post: process.env.PORT_DB,
    },
    migrations: {
      directory: path.join(__dirname, "./models/migrations"),
    },
  },
};
