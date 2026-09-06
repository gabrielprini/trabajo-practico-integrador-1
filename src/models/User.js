import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const user = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20],
      },
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      // indica el rol del usuario. Y si no elejimos rol sera user
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "User",
    tableName: "users",
    paranoid: true,
    timestamps: true,
    // Esto le dice a Sequelize: "Cada vez que consultes User, por defecto NO me traigas el password."
    defaultScope: {
      attributes: { exclude: ["password"] }, // nunca devolver el hash por defecto
    },
    // agregamos esto porque en el login sí necesitamos el password, para poder comparar la contraseña que escribió el usuario con el hash guardado.
    // Entonces necesitamos una forma especial de decir: "Para ESTA consulta en particular, necesito el password.", por eso creamos un scope especial
    scopes: {
        // Con contraseña. user.findOne(...) la consulta normal no trae la contraseña y user.scope('withPassword').findOne(...) trae la contraseña 
      withPassword: {
        // Básicamente estamos diciendo: "No quiero aplicar una exclusión de atributos acá." Entonces el password vuelve a estar disponible.
        attributes: {}, 
      },
    },
  },
);
