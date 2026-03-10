export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://postgres:123456789@localhost:5432/gpt-bis',
  jwtSecret: process.env.JWT_SECRET ?? 'changeme',
  jwtExpiration: process.env.JWT_EXPIRATION ?? '1d',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
});
