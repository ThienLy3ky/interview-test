// Update with your config settings.
const path = require("path");
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "admin123",
      database: "testinterview",
    },
    migrations: {
      directory: path.join(__dirname, "./models/migrations"),
    },
  },
};
