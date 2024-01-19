import { COCKROACH_DB_CONNECTION_STRING } from "./settings";
import { DataTypes, Model } from "sequelize";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(COCKROACH_DB_CONNECTION_STRING);

interface VttAttributes {
    id: string;
    transcript: object;
}

export class Vtt extends Model<VttAttributes> implements VttAttributes {
    public id!: string;
    public transcript!: object;
}

Vtt.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        transcript: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    },
    {
        sequelize,
        modelName: "Vtt",
        tableName: "vtt",
    }
);

interface ContentAttributes {
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    data: object;
}

export class Content extends Model<ContentAttributes> implements ContentAttributes {
    public id?: string;
    public created_at?: Date;
    public updated_at?: Date;
    public data!: object;
}

Content.init(
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
        modelName: "Content",
        tableName: "content",
    }
);

interface FileAttributes {
    id?: string;
    storage_type?: string;
    created_at?: Date;
    updated_at?: Date;
    data: object;
}

export class File extends Model<FileAttributes> implements FileAttributes {
    public id?: string;
    public storage_type?: string;
    public created_at?: Date;
    public updated_at?: Date;
    public data!: object;
}

File.init(
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
        modelName: "File",
        tableName: "files",
    }
);
