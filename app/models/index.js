const Sequelize = require("sequelize");
const config = require("../config/db.config");
const dotenvParseVariables = require('dotenv-parse-variables');
let env = require('dotenv').config();
env = dotenvParseVariables(env.parsed);
// console.log(process.env.HOST,process.env.poolMin)

var sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect:  process.env.dialect,
  operatorsAliases: 0,
  logging:false,
  pool: {
    max: parseInt(process.env.poolMax),
    min: parseInt(process.env.poolMin),
    acquire: process.env.acquire,
    idle: process.env.idle,
  },
});

const db = {};

db.sequelize = sequelize;
db.user = require("./user.models")(sequelize, Sequelize);
db.builderUser = require("./builderUser.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.category = require("./category.model")(sequelize, Sequelize);
db.userCategory = require("./userCategory.model")(sequelize, Sequelize);

db.user.hasMany(db.builderUser, {foreignKey:'updated_by',as: 'updated_by_id' });
db.builderUser.belongsTo(db.user, { foreignKey: 'updated_by',as: 'updated_by_id' });

db.user.hasMany(db.builderUser, {foreignKey:'created_by',as: 'created_by_id' });
db.builderUser.belongsTo(db.user, { foreignKey: 'created_by',as: 'created_by_id' });

db.user.hasOne(db.builderUser, { foreignKey: 'user_id' });
db.builderUser.belongsTo(db.user, { foreignKey: 'user_id' });

db.role.hasOne(db.user, { foreignKey: 'role_id' });
db.user.belongsTo(db.role, { foreignKey: 'role_id' });

db.user.hasMany(db.userCategory, { foreignKey: 'user_id' });
db.userCategory.belongsTo(db.user, { foreignKey: 'user_id' });

db.category.hasOne(db.userCategory, { foreignKey: 'category_id' });
db.userCategory.belongsTo(db.category, { foreignKey: 'category_id' });

module.exports = db;
