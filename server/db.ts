import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger";

const environment = process.env.NODE_ENV || "development";
if (environment == "development") {
  dotenv.config({ path: "./.env.development" });
} else dotenv.config({ path: "./.env" });

if (
  !process.env.DB_NAME ||
  !process.env.DB_USER ||
  !process.env.DB_PASS ||
  !process.env.DB_HOST
)
  throw new Error("Environment variables are not set");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (msg) => logger.debug(msg),
  }
);

sequelize
  .authenticate()
  .then(() =>
    logger.info("Sequelize connection has been established successfully.")
  )
  .catch((error) =>
    logger.error("Sequelize was unable to connect to the database:", error)
  );

const Message = sequelize.define(
  "message",
  {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    updatedAt: false,
  }
);

export const Tag = sequelize.define(
  "tag",
  { name: { type: DataTypes.STRING } },
  { timestamps: false }
);

Message.belongsToMany(Tag, { through: "message_tags" });
Tag.belongsToMany(Message, { through: "message_tags" });

(async () => {
  await sequelize.sync();
})();

Message.createNewMessage = async function (message: {
  text: string;
  tags: string[];
}) {
  const newMessage = await Message.create({
    text: message.text,
  });

  const newTags = await Promise.all(
    message.tags.map(async (tag: string) => {
      const [newTag] = await Tag.findOrCreate({ where: { name: tag } });
      return newTag;
    })
  );

  newMessage.addTags(newTags, { through: "message_tags" });
};

Message.getMessageHistory = async function () {
  const history = await Message.findAll({
    attributes: ["text"],
    include: [
      {
        model: Tag,
        attributes: [["name", "tag"]],
        through: { attributes: [] },
      },
    ],
  });
  const transformed = history.map((m) => m.toJSON());
  return transformed.map((m) => {
    return { text: m.text, tags: m.tags.map((t) => t.tag) };
  });
};

export default Message;
