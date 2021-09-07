import knex from 'knex';
import path from 'path';

const database = knex({
  client: process.env.DB_CONNECTION || 'pq',
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