import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

module.exports = {
    client: process.env.DB_CONNECTION,
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true
};