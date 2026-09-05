import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const user = sequelize.define(
    "User",
    {
        id: {
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true, 
            validate: {
                len: [ 3, 20]
            }
        },

        email: {
            type:DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: {
            type:DataTypes.STRING(255),
            allowNull: false
        },

        role: {
            // indica el rol del usuario. Y si no elejimos rol sera user
            type: DataTypes.ENUM("user", "admin"),
            defaultValue: "user",
            allowNull: false
        }
    },

    {
        sequelize,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        timestamps: true 
    },  
);