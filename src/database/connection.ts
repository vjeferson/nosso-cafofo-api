import knex from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const database = knex({
  client: process.env.DB_CONNECTION,
  connection: {
      host : process.env.DB_HOST,
      port : Number(process.env.DB_PORT),
      database : process.env.DB_DATABASE,
      user : process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD
  },
  migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  useNullAsDefault: true
});

export default database;