module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'zymr@123',
    DB: 'wordstation_dev',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
