const { Sequelize } = require("sequelize");
const dbHost = process.env.PGHOST;
const dbUser = process.env.PGUSER;
const dbPassword = process.env.PGPASSWORD;
const dbName = process.env.PGDATABASE;
const dbPort = process.env.PGPORT;

const sequelizeContent = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  define: {
    timestamps: false,
    idleTimeoutMillis: 30000,
    max: 10,
  },
});

const sequelizeCF = new Sequelize("cube_cloudflare", dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  define: {
    timestamps: false,
    idleTimeoutMillis: 30000,
    max: 10,
  },
});

const vtt = sequelizeContent.define(
  "vtt",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    transcript: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
  },
  {
    freezeTableName: true,
  }
);

const content = sequelizeContent.define(
  "content",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    data: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    freezeTableName: true,
  }
);
const files = sequelizeCF.define(
  "files",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    storage_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    data: {
      type: Sequelize.JSONB,
      defaultValue: {},
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = {
  vtt,
  content,
  files,
};
