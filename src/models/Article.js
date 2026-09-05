import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const article = sequelize.define(
    "Article",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },

        title: {
            type: DataTypes.STRING(200),
            validate: {
                len: [ 3, 200],
            },
            allowNull: false
        },

        content: {
            type: DataTypes.TEXT,
            validate: {
                len: [ 50, 10000]
            },
            allowNull: false
        },

        excerpt: {
            type: DataTypes.STRING(500)
        },

        status: {
            type:DataTypes.ENUM('published', 'archived'),
            defaultValue: "published",
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },

    {
        timestamps: true
    },
);