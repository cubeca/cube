import he from 'he';
import validator from 'validator';

export type FieldError = {
  type: 'field';
  value: unknown;
  msg: string;
  path: string;
  location: 'body';
};

export type ValidatedUserInput = {
  name: string;
  email: string;
  password: string;
  organization?: string;
  website?: string;
  tag?: string;
};

/**
 * Same checks as the express-validator chain on POST /auth/user:
 * trim + escape, validator.isEmail, validator.normalizeEmail defaults.
 * `website` is escaped and then `he.decode`d, which is what the old route stored.
 */
export function validateUserCreateInput(body: Record<string, unknown>): { errors: FieldError[]; value: ValidatedUserInput } {
  const errors: FieldError[] = [];

  const nameRaw = typeof body.name === 'string' ? body.name : '';
  const name = validator.escape(nameRaw.trim());
  if (!name) {
    errors.push({ type: 'field', value: body.name, msg: 'Name is required.', path: 'name', location: 'body' });
  }

  const emailRaw = typeof body.email === 'string' ? body.email : '';
  let email = emailRaw;
  if (!validator.isEmail(emailRaw)) {
    errors.push({ type: 'field', value: body.email, msg: 'Invalid email.', path: 'email', location: 'body' });
  } else {
    email = validator.normalizeEmail(emailRaw) || emailRaw;
  }

  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length < 8) {
    errors.push({
      type: 'field',
      value: body.password,
      msg: 'Password must be at least 8 characters long.',
      path: 'password',
      location: 'body'
    });
  }

  const value: ValidatedUserInput = { name, email, password };

  if ('organization' in body && body.organization !== undefined && body.organization !== null) {
    value.organization = validator.escape(String(body.organization).trim());
  }
  if ('website' in body && body.website !== undefined && body.website !== null) {
    value.website = he.decode(validator.escape(String(body.website).trim()));
  }
  if ('tag' in body && body.tag !== undefined && body.tag !== null) {
    value.tag = validator.escape(String(body.tag).trim());
  }

  return { errors, value };
}
