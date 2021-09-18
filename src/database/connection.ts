import knex from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const database = knex({
  client: process.env.DB_CONNECTION,
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations')
  },
  useNullAsDefault: true,
  // postProcessResponse: (result, queryContext) => {
  //   // TODO: add special case for raw results (depends on dialect)
  //   if (Array.isArray(result)) {
  //     return result.map(row => convertToCamel(row));
  //   } else {
  //     return convertToCamel(result);
  //   }
  // }
});

export default database;