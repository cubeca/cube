import yaml
from sqlalchemy import orm
from sqlalchemy.dialects.postgresql import JSONB
import sqlalchemy as db

creds = yaml.safe_load(open('./creds.yaml'))

src_db_password = creds['src_password']
src_db_user = creds['src_username']
src_db_host = creds['src_host']
src_db_port = creds['src_port']
dst_uri = creds['dst_uri']


dst_engine =  db.create_engine(dst_uri,
    connect_args={
        "sslrootcert": './root.crt',
        'connect_timeout': 5,
    })
src_cloudflare_engine = db.create_engine(f'postgresql://{src_db_user}:{src_db_password}@{src_db_host}:{src_db_port}/cube_cloudflare')
src_content_engine = db.create_engine(f'postgresql://{src_db_user}:{src_db_password}@{src_db_host}:{src_db_port}/cube_content')
src_identity_engine = db.create_engine(f'postgresql://{src_db_user}:{src_db_password}@{src_db_host}:{src_db_port}/cube_identity')
src_profile_engine = db.create_engine(f'postgresql://{src_db_user}:{src_db_password}@{src_db_host}:{src_db_port}/cube_profile')
base = orm.declarative_base()





def to_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}


def create_session(engine):
    return orm.sessionmaker(
        bind=engine,
    )()


def create_session_write(engine):
    return orm.sessionmaker(
        bind=engine
    )()

    
class File(base):
    __tablename__ = 'files'
    id = db.Column(db.String, primary_key=True)
    storage_type = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    data = db.Column(JSONB)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Content(base):
    __tablename__ = 'content'
    id = db.Column(db.String, primary_key=True)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    data = db.Column(JSONB)    

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Vtt(base):
    __tablename__ = 'vtt'
    id = db.Column(db.String, primary_key=True)
    transcript = db.Column(JSONB)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class User(base):
    __tablename__ = 'users'
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String)
    password = db.Column(db.String)
    permission_ids = db.Column(db.ARRAY(db.String))
    is_active = db.Column(db.Boolean)
    has_verified_email = db.Column(db.Boolean)
    has_accepted_terms = db.Column(db.Boolean)
    has_accepted_newsletter = db.Column(db.Boolean)
    profile_id = db.Column(db.String)    

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Profile(base):
    __tablename__ = 'profiles'
    id = db.Column(db.String, primary_key=True)
    organization = db.Column(db.String)
    website = db.Column(db.String)
    tag = db.Column(db.String)
    herofileid = db.Column(db.String)
    logofileid = db.Column(db.String)
    description = db.Column(db.String)
    descriptionfileid = db.Column(db.String)
    budget = db.Column(db.String)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}




src_cloudflare_session = create_session(src_cloudflare_engine)
src_content_session = create_session(src_content_engine)
src_identity_session = create_session(src_identity_engine)
src_profile_session = create_session(src_profile_engine)


files = src_cloudflare_session.query(File).all()
contents = src_content_session.query(Content).all()
vtts = src_content_session.query(Vtt).all()
users = src_identity_session.query(User).all()
profiles = src_profile_session.query(Profile).all()

dst_session = create_session_write(dst_engine)
for file in files:
    #check if file exists
    if dst_session.query(File).filter_by(id=file.id).first() is None:
        #clone file to avoid session issues
        obj_to_add = File(**file.to_dict())
        dst_session.add(obj_to_add)
        print(f'added file {file.id}')
    else:
        #update
        dst_session.query(File).filter_by(id=file.id).update(file.to_dict())
        print(f'updated file {file.id}')
print('committing files')
dst_session.commit()
print('done')

for content in contents:
    #check if content exists
    if dst_session.query(Content).filter_by(id=content.id).first() is None:
        #clone content to avoid session issues
        obj_to_add = Content(**content.to_dict())
        dst_session.add(obj_to_add)
        print(f'added content {content.id}')
    else:
        #update
        dst_session.query(Content).filter_by(id=content.id).update(content.to_dict())
        print(f'updated content {content.id}')
print('committing content')
dst_session.commit()
print('done')

for vtt in vtts:
    #check if vtt exists
    if dst_session.query(Vtt).filter_by(id=vtt.id).first() is None:
        #clone vtt to avoid session issues
        obj_to_add = Vtt(**vtt.to_dict())
        dst_session.add(obj_to_add)
        print(f'added vtt {vtt.id}')
    else:
        #update
        dst_session.query(Vtt).filter_by(id=vtt.id).update(vtt.to_dict())
        print(f'updated vtt {vtt.id}')
print('committing vtts')
dst_session.commit()
print('done')

for user in users:
    #check if user exists
    if dst_session.query(User).filter_by(id=user.id).first() is None:
        #clone user to avoid session issues
        obj_to_add = User(**user.to_dict())
        dst_session.add(obj_to_add)
        print(f'added user {user.id}')
    else:
        #update
        dst_session.query(User).filter_by(id=user.id).update(user.to_dict())
        print(f'updated user {user.id}')
print('committing users')
dst_session.commit()
print('done')

for profile in profiles:
    #check if profile exists
    if dst_session.query(Profile).filter_by(id=profile.id).first() is None:
        #clone profile to avoid session issues
        obj_to_add = Profile(**profile.to_dict())
        dst_session.add(obj_to_add)
        print(f'added profile {profile.id}')
    else:
        #update
        dst_session.query(Profile).filter_by(id=profile.id).update(profile.to_dict())
        print(f'updated profile {profile.id}')
print('committing profiles')
dst_session.commit()
print('done')

