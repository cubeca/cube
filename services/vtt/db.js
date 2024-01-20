const { COCKROACH_DB_CONNECTION_STRING } = require("./settings");
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(COCKROACH_DB_CONNECTION_STRING, {
  schema: "cube",
});

const vtt = sequelize.define(
  "vtt",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transcript: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "vtt",
    tableName: "vtt",
    timestamps: false,
  }
);

const content = sequelize.define(
  "content",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "content",
    tableName: "content",
    timestamps: false,
  }
);

const files = sequelize.define(
  "files",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    storage_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "files",
    tableName: "files",
    timestamps: false,
  }
);

module.exports = {
  sequelize,
  vtt,
  content,
  files,
};
