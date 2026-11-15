/** Returned by login and change-password when the stored password cannot be decrypted. */
export const PASSWORD_RESET_REQUIRED = 'PASSWORD_RESET_REQUIRED';

/** Single copy string for the forced password refresh. */
export const PASSWORD_REFRESH_MESSAGE =
  "For your security, we've introduced a periodic password refresh. We've emailed you a link to set a new password.";

export function isPasswordResetRequired(error: unknown): boolean {
  const data = (error as { response?: { data?: unknown } } | null)?.response?.data;
  return Boolean(data && typeof data === 'object' && 'code' in data && (data as { code?: unknown }).code === PASSWORD_RESET_REQUIRED);
}
