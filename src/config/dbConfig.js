require('dotenv').config(); // this is important!

module.exports = {
    "development": {
      "username": "swetak",
      "password": "Wings@123",
      "database": "utside",
      "host": "127.0.0.1",
      "dialect": "mysql",
      "seederStorageTableName":"sequelize_data",
      "logging": false
    },
    "staging": {
      "username": "utside",
      "password": "Sweyih3*$@#FDJWQkyrc;jshwe5646554",
      "database": "utside_staging",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "utside",
      "password": "Sweyih3*$@#FDJWQkyrc;jshwe5646554",
      "database": "utside",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }
  