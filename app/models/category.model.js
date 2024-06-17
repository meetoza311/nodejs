const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        category_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        category_name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
    }, {
        tableName: 'Category',
        // timestamps: false
    });

    return Category;
};