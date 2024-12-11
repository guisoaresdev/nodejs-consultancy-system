import dotenv from "dotenv";
dotenv.config();

/**
 * Classe que define os parâmetros de acesso ao SGBD
 */
const dbConfig = {
  database: process.env.database,
  username: process.env.username,
  password: process.env.password,
  host: process.env.host,
  dialect: process.env.dialect,
};

export default dbConfig;
