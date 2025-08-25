import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/digipratibha',
  jwtSecret: process.env.JWT_SECRET || 'change_me_in_env',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change_me_refresh_in_env',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
};

export type AppConfig = typeof config;


