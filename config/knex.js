const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    post: 3306,
    password: "admin123",
    database: "testinterview",
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
