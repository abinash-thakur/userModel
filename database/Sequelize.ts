import { Sequelize } from 'sequelize';
const DATABASE = "postgres";
const DBUSER = "postgres";
const PASSWORD = "Abinash299@"

const DBCred = new Sequelize(DATABASE, DBUSER, PASSWORD, {
  dialect: 'postgres',
});

export default DBCred;