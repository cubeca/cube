import { User } from '../models';

/**
 * Insert a new user identity into the database.
 *
 * @function
 * @name insertIdentity
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} profileId - The profile ID associated with the user.
 * @param {string} password - The password of the user.
 * @param {string[]} permissionIds - The list of permission IDs for the user.
 * @param {boolean} hasAcceptedTerms - Whether the user has accepted the terms.
 * @param {boolean} hasAcceptedNewsletter - Whether the user has accepted the newsletter.
 * @param {boolean} isOver18 - Whether the user is over 18 years old.
 * @returns {Promise<User>} The inserted user object.
 * @throws {Error} If the insertion fails.
 */
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

/**
 * Update the email address of a user.
 *
 * @function
 * @name updateEmail
 * @param {string} id - The ID of the user.
 * @param {string} email - The new email address of the user.
 * @throws {Error} If the user is not found.
 */
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

/**
 * Update the password of a user.
 *
 * @function
 * @name updatePassword
 * @param {string} id - The ID of the user.
 * @param {string} password - The new password of the user.
 * @throws {Error} If the user is not found.
 */
export const updatePassword = async (id: string, password: string) => {
  const user = await User.findByPk(id);
  if (user) {
    user.password = password;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

/**
 * Select a user by their email address.
 *
 * @function
 * @name selectUserByEmail
 * @param {string} email - The email address of the user.
 * @returns {Promise<User|null>} The user object, or null if not found.
 */
export const selectUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

/**
 * Select a user by their ID.
 *
 * @function
 * @name selectUserByID
 * @param {string} id - The ID of the user.
 * @returns {Promise<User|null>} The user object, or null if not found.
 */
export const selectUserByID = async (id: string) => {
  return await User.findByPk(id);
};

/**
 * Update the email verification status of a user.
 *
 * @function
 * @name updateEmailVerification
 * @param {string} id - The ID of the user.
 * @param {boolean} hasBeenVerified - The new email verification status.
 * @throws {Error} If the user is not found.
 */
export const updateEmailVerification = async (id: string, hasBeenVerified: boolean) => {
  const user = await User.findByPk(id);
  if (user) {
    user.has_verified_email = hasBeenVerified;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

/**
 * Add permission IDs to a user.
 *
 * @function
 * @name addPermissionIds
 * @param {string} id - The ID of the user.
 * @param {string[]} perms - The permission IDs to add.
 * @throws {Error} If the user is not found.
 */
export const addPermissionIds = async (id: string, perms: string[]) => {
  const user = await User.findByPk(id);
  if (user) {
    user.permission_ids = [...user.permission_ids, ...perms];
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

/**
 * Update the active status of a user.
 *
 * @function
 * @name updateActiveStatus
 * @param {string} id - The ID of the user.
 * @param {boolean} status - The new active status of the user.
 * @throws {Error} If the user is not found.
 */
export const updateActiveStatus = async (id: string, status: boolean) => {
  const user = await User.findByPk(id);
  if (user) {
    user.is_active = status;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};
