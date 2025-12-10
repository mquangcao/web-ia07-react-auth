module.exports = {
  port: 3008,
  appName: 'ia06',
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
};
