module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    mobileNumber:{
      type: Sequelize.STRING(15),
      allowNull: false,
      unique:true
    },
    otp: {
      type: Sequelize.STRING(6),
      allowNull: true
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    role_id: {
      type: Sequelize.INTEGER,
    }
  }, {
    tableName: 'User',
    // timestamps: false
  });

  return User;
};