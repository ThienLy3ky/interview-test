/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("Users", function (table) {
      table.increments("id").primary();
      table.string("firstName", 30).notNullable();
      table.string("lastName", 30).notNullable();
      table.string("email", 250).notNullable();
      table.string("password");
      table.timestamps(true, true);
    })
    .createTable("Tokens", function (table) {
      table.increments("id").primary();
      table.integer("userId", 10).unsigned().references("id").inTable("users");
      table.string("refreshToken", 250).notNullable();
      table.string("expiresIn", 64).notNullable();
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("Tokens").dropTable("Users");
};
