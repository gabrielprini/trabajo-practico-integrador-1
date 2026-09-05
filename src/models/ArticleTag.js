import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const articleTag = sequelize.define(
    "ArticleTag",
    {
        id: {
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },

    {
        paranoid: true,
        timestamps: true 
    }
)