import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const profile = sequelize.define(
    "Profile",
    {
        id: {
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        user_id: {
            type:DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },

        first_name: {
            type:DataTypes.STRING(50),
            allowNull: false
        },

        last_name: {
            type:DataTypes.STRING(50),
            allowNull: false
        },

        biography: {
            type:DataTypes.TEXT
        },

        avatar_url: {
            type: DataTypes.STRING(255)
        },

        birth_date: {
            type:DataTypes.DATE
        }
    },

    {
        sequelize,
        modelName: "Profile",
        tableName: 'profiles',
        timestamps: true
    }
)