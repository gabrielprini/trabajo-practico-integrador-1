import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const tag = sequelize.define(
    "Tag",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING(30),
            unique: true,
            allowNull: false,
            validate: {
                len: [ 2, 30 ]
            }
        },
    },

    {
        timestamps: true
    }
)