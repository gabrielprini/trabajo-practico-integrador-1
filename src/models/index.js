import sequelize from "../config/database.js";
import { user } from "./user.js";
import { tag } from "./tag.js";
import { profile } from "./profile.js";
import { article } from "./article.js";
import { articleTag } from "./articleTag.js";

user.hasOne(profile, { foreignKey: "user_id", as: "profile"});
profile.belongsTo(user, { foreignKey: "user_id", as: "user"});

user.hasMany(article, { foreignKey: "user_id", as: "articles"});
article.belongsTo(user, { foreignKey: "user_id", as: "author"});

article.belongsToMany(tag, { through: articleTag, otherKey:"tag_id",
foreignKey: "article_id", as: "tags" });
tag.belongsToMany(article, { through: articleTag, otherKey:"article_id",
foreignKey: "tag_id", as: "articles" });

article.hasMany(articleTag, { foreignKey: "article_id", as: "articleTags" });
articleTag.belongsTo(article, { foreignKey: "article_id", as: "article" })

tag.hasMany(articleTag, { foreignKey: "tag_id", as: "articleTags"});
articleTag.belongsTo(tag, { foreignKey: "tag_id", as: "tag"});

export { sequelize, user, profile, article, tag, articleTag };



