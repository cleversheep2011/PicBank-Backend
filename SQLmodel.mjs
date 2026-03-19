import {QueryTypes,DataTypes, Sequelize, UUIDV4} from "sequelize";
import {fileURLToPath} from "url";
import {dirname, join} from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sequelize = new Sequelize({
    dialect: "sqlite", storage: join(__dirname, "database.sqlite"),
});

export const User = sequelize.define('User', {
    uuid: {
        type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true
    }, username: {
        type: DataTypes.STRING, allowNull: false
    }, password: {
        type: DataTypes.STRING, allowNull: false
    }, email: {
        type: DataTypes.STRING
    }, isActive: {
        type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false
    }
}, {freezeTableName: true});

await sequelize.sync({alter: true});