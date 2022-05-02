const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    first_name: {type: DataTypes.STRING},
    last_name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true,},
    phone: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},


})



module.exports = {
    User
}