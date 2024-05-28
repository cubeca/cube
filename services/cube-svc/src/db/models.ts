import { DataTypes, Model } from 'sequelize';
import { sequelize } from './connection';

interface FileAttributes {
  id?: string;
  storage_type?: string;
  created_at?: Date;
  updated_at?: Date;
  data: object;
}

export class File extends Model<FileAttributes> implements FileAttributes {
  public declare id?: string;
  public declare storage_type?: string;
  public declare created_at?: Date;
  public declare updated_at?: Date;
  public declare data: object;
}

File.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    storage_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  },
  {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    paranoid: true,
    timestamps: false
  }
);

interface ContentAttributes {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  data: object;
}

export class Content extends Model<ContentAttributes> implements ContentAttributes {
  public declare id?: string;
  public declare created_at?: Date;
  public declare updated_at?: Date;
  public declare data: object;
}

Content.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  },
  {
    sequelize,
    modelName: 'Content',
    tableName: 'content',
    timestamps: false,
    paranoid: true
  }
);

interface VttAttributes {
  id: string;
  transcript: object;
}

export class Vtt extends Model<VttAttributes> implements VttAttributes {
  public declare id: string;
  public declare transcript: object;
}

Vtt.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    transcript: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  },
  {
    sequelize,
    modelName: 'Vtt',
    tableName: 'vtt',
    paranoid: true,
    timestamps: false
  }
);

interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
  permission_ids: string[];
  is_active: boolean;
  has_verified_email?: boolean;
  has_accepted_terms: boolean;
  has_accepted_newsletter: boolean;
  profile_id: string | null;
  is_over_18: boolean;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public declare id?: string;
  public declare name: string;
  public declare email: string;
  public declare password: string;
  public declare permission_ids: string[];
  public declare is_active: boolean;
  public declare has_verified_email?: boolean;
  public declare has_accepted_terms: boolean;
  public declare has_accepted_newsletter: boolean;
  public declare profile_id: string | null;
  public declare is_over_18: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permission_ids: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    has_verified_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    has_accepted_terms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    has_accepted_newsletter: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    profile_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_over_18: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    timestamps: false
  }
);

interface ProfileAttributes {
  id?: string;
  organization: string;
  website: string;
  tag: string;
  herofileid: string;
  logofileid: string;
  description: string;
  descriptionfileid: string;
  budget: string;
  status: string;
}

export class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
  public declare id?: string;
  public declare organization: string;
  public declare website: string;
  public declare tag: string;
  public declare herofileid: string;
  public declare logofileid: string;
  public declare description: string;
  public declare descriptionfileid: string;
  public declare budget: string;
  public declare status: string;
}

Profile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    herofileid: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    logofileid: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    descriptionfileid: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    budget: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    }
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles',
    paranoid: true,
    timestamps: false
  }
);

interface PlaylistAttributes {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  data: object;
}

export class Playlist extends Model<PlaylistAttributes> implements PlaylistAttributes {
  public declare id?: string;
  public declare created_at?: Date;
  public declare updated_at?: Date;
  public declare data: object;
}

Playlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  },
  {
    sequelize,
    modelName: 'Playlist',
    tableName: 'playlists',
    timestamps: false,
    paranoid: true
  }
);
