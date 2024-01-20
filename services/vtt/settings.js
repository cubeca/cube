const dotenv = require("dotenv");
dotenv.config();

const COCKROACH_DB_CONNECTION_STRING =
  process.env.COCKROACH_DB_CONNECTION_STRING ||
  "postgresql://root@localhost:26257/defaultdb?sslmode=disable";

const PORT = parseInt(process.env.PORT || "8080", 10);
const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || "secret";

const PGHOST = process.env.PGHOST || "localhost";
const PGPORT = parseInt(process.env.PGPORT || "5432", 10);
const PGUSER = process.env.PGUSER || "postgres";
const PGPASSWORD = process.env.PGPASSWORD || "admin";
const PGDATABASE = process.env.PGDATABASE || "cube_identity";
const PGUSERDATABASE = process.env.PGUSERDATABASE || "cube_identity";

module.exports = {
  COCKROACH_DB_CONNECTION_STRING,
  PORT,
  JWT_TOKEN_SECRET,
  PGHOST,
  PGPORT,
  PGUSER,
  PGPASSWORD,
  PGDATABASE,
  PGUSERDATABASE,
};
