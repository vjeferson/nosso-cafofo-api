import { ConnectionOptions } from 'typeorm';

const configDatabase: ConnectionOptions = {
  type: process.env.TYPEORM_CONNECTION as any || 'postgres',
  database: process.env.TYPEORM_DATABASE || 'nossocafofo',
  username: process.env.TYPEORM_USERNAME || 'postgres',
  password: process.env.TYPEORM_PASSWORD || 'sublime',
  host: process.env.TYPEORM_HOST || 'localhost',
  port: Number(process.env.TYPEORM_PORT) || 5432,
  synchronize: false,
  logging: true,
  entities: ['src/entities/**/*.ts'],
  migrations: [
    'src/migrations/**/*.ts'
  ],
  cli: {
    entitiesDir: process.env.TYPEORM_ENTITIES_DIR || 'src/entities',
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || 'src/migrations',
    subscribersDir: 'src/subscriber'
  },
};

export default configDatabase;