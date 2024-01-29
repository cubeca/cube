import { User } from '../models';

export const insertIdentity = async (
  name: string,
  email: string,
  profileId: string,
  password: string,
  permissionIds: string[],
  hasAcceptedTerms: boolean,
  hasAcceptedNewsletter: boolean,
  isOver18: boolean
) => {
  try {
    const user = await User.create({
      name,
      email,
      profile_id: profileId,
      password,
      permission_ids: permissionIds,
      is_active: false,
      has_accepted_terms: hasAcceptedTerms,
      has_accepted_newsletter: hasAcceptedNewsletter,
      is_over_18: isOver18
    });

    return user;
  } catch (error) {
    throw new Error('Failed to insert identity');
  }
};

export const updateEmail = async (id: string, email: string) => {
  const user = await User.findByPk(id);
  if (user) {
    user.email = email;
    user.has_verified_email = false;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

export const updatePassword = async (id: string, password: string) => {
  const user = await User.findByPk(id);
  if (user) {
    user.password = password;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

export const selectUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const selectUserByID = async (id: string) => {
  return await User.findByPk(id);
};

export const updateEmailVerification = async (id: string, hasBeenVerified: boolean) => {
  const user = await User.findByPk(id);
  if (user) {
    user.has_verified_email = hasBeenVerified;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

export const addPermissionIds = async (id: string, perms: string[]) => {
  const user = await User.findByPk(id);
  if (user) {
    user.permission_ids = [...user.permission_ids, ...perms];
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

export const updateActiveStatus = async (id: string, status: boolean) => {
  const user = await User.findByPk(id);
  if (user) {
    user.is_active = status;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};
