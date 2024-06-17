const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        role_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
    }, {
        tableName: 'Role',
        // timestamps: false
    });

    return Role;
};