import { Sequelize } from 'sequelize';
import { COCKROACH_DB_CONNECTION_STRING } from '../settings';

export const sequelize = new Sequelize(COCKROACH_DB_CONNECTION_STRING, {
  schema: 'cube',
  logging: false
});
