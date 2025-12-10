module.exports = {
  port: 3008,
  appName: 'ia07',
  allowOriginUrl: 'http://localhost:5173',
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    dbName: 'postgres',
    logging: false,
  },
  jwt: {
    secret: 'your-secret-key',
    refreshSecret: 'your-refresh-secret-key',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
};
