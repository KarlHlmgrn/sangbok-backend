const { Sequelize, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const sequelize = new Sequelize({
    dialect: 'mariadb',
    host: '127.0.0.1',
    port: 3306,
    username: 'futf',
    password: 'kulnastanjamt',
    database: 'sangbok',
});

// Creates a Event model for the events table
class Event extends Model {}
Event.init({
    name: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    imgSrc: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    startDate: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    endDate: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    location: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    hosts: {
        type: DataTypes.STRING,
        defaultValue: '[]',
        get() {
            return JSON.parse(this.getDataValue('hosts'));
        },
        set(val) {
            this.setDataValue('hosts', JSON.stringify(val));
        }
    },
    pdfSrc: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize, modelName: 'event', underscored: true });

// Creates a User model for the users table
class User extends Model {}
User.init({
    username: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    password: {
        type: DataTypes.STRING,
        defaultValue: '',
        set(val) {
            // When the password field is set it gets hashed
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(val, salt);
            this.setDataValue('password', hash);
        }
    }
}, { sequelize, modelName: 'user', underscored: true });

module.exports = { sequelize, Event, User };