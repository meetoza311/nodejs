const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const UserCategory = sequelize.define('UserCategory', {
        user_category_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        category_id: {
            type: Sequelize.INTEGER,
        },
    }, {
        tableName: 'UserCategory',
        // timestamps: false
    });

    return UserCategory;
};