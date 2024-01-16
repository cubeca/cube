import { DataTypes, Model } from 'sequelize';
import { sequelize } from './connection';

interface FileAttributes {
  id: string;
  storage_type: string;
  created_at: Date;
  updated_at: Date;
  data: object;
}

export class File extends Model<FileAttributes> implements FileAttributes {
  public id!: string;
  public storage_type!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public data!: object;
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
  },aimport { DataTypes, Model } from 'sequelize';
  import { sequelize } from './connection';
  
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
      tableName: 'files'
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
      tableName: 'contents'
    }
  );
  
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
      tableName: 'vtts'
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
    public id?: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public permission_ids!: string[];
    public is_active!: boolean;
    public has_verified_email?: boolean;
    public has_accepted_terms!: boolean;
    public has_accepted_newsletter!: boolean;
    public profile_id!: string | null;
    public is_over_18!: boolean;
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
      tableName: 'users'
    }
  );
  
  interface ProfileAttributes {
    id: string;
    organization: string;
    website: string;
    tag: string;
    herofileid: string;
    logofileid: string;
    description: string;
    descriptionfileid: string;
    budget: string;
  }
  
  export class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
    public id!: string;
    public organization!: string;
    public website!: string;
    public tag!: string;
    public herofileid!: string;
    public logofileid!: string;
    public description!: string;
    public descriptionfileid!: string;
    public budget!: string;
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
      }
    },
    {
      sequelize,
      modelName: 'Profile',
      tableName: 'profiles'
    }
  );
  
  {
    sequelize,
    modelName: 'File',
    tableName: 'files'
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
    tableName: 'contents'
  }
);

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
    tableName: 'vtts'
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
  public id?: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public permission_ids!: string[];
  public is_active!: boolean;
  public has_verified_email?: boolean;
  public has_accepted_terms!: boolean;
  public has_accepted_newsletter!: boolean;
  public profile_id!: string | null;
  public is_over_18!: boolean;
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
    tableName: 'users'
  }
);

interface ProfileAttributes {
  id: string;
  organization: string;
  website: string;
  tag: string;
  herofileid: string;
  logofileid: string;
  description: string;
  descriptionfileid: string;
  budget: string;
}

export class Profile extends Model<ProfileAttributes> implements ProfileAttributes {
  public id!: string;
  public organization!: string;
  public website!: string;
  public tag!: string;
  public herofileid!: string;
  public logofileid!: string;
  public description!: string;
  public descriptionfileid!: string;
  public budget!: string;
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
    }
  },
  {
    sequelize,
    modelName: 'Profile',
    tableName: 'profiles'
  }
);
