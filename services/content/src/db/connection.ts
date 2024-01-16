import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { COCKROACH_DB_CONNECTION_STRING } from '../settings';
dotenv.config();

export const sequelize = new Sequelize(COCKROACH_DB_CONNECTION_STRING);

export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
