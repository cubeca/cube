import { Sequelize } from 'sequelize';
import { COCKROACH_DB_CONNECTION_STRING } from '../../src/settings';

export const sequelize = new Sequelize(COCKROACH_DB_CONNECTION_STRING, {
  schema: 'cube'
});
