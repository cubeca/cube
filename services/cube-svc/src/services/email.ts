import type { Env } from '../env';
import type { Sql } from '../db/sql';
import * as identityDb from '../db/queries/identity';
import { signCubeJwt } from '../utils/jwt';
import { encodeUuidBase36 } from '../utils/uuid';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

export const brevoTemplateIdMapping = {
  SEND_VERIFICATION_EMAIL: 2,
  PASSWORD_CHANGE_CONFIRMATION: 3,
  PASSWORD_RESET_EMAIL: 4,
  REPORT_ABUSE_TEMPLATE: 12,
  CONTACT_US_EMAIL: 19,
  NEW_PROFILE_REGISTRATION_NOTIFICATION: 20
};

type EmailMessage = {
  sender: { name: string; email: string };
  to: { name?: string; email: string }[];
  templateId: number;
  params: Record<string, string>;
};

async function sendTemplate(env: Env, message: EmailMessage, failure: string): Promise<void> {
  const response = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY
    },
    body: JSON.stringify(message)
  });
  if (!response.ok) {
    console.error(failure, response.status, await response.text());
    throw new Error(failure);
  }
}

export async function sendVerificationEmail(env: Env, name: string, email: string, token: string): Promise<void> {
  if (!email || !token) throw new Error('Invalid parameters');
  await sendTemplate(
    env,
    {
      sender: { name: 'CubeCommons Email Verification', email: 'donotreply@cubecommons.ca' },
      to: [{ name: name ? name : 'CubeCommons User', email }],
      templateId: brevoTemplateIdMapping.SEND_VERIFICATION_EMAIL,
      params: {
        NAME: `${name}`,
        EMAIL_VERIFICATION_URL: `${env.CUBE_SVC_HOST}/auth/email/verify/${token}`
      }
    },
    'Error sending verification email'
  );
}

export async function sendPasswordChangeConfirmation(env: Env, sql: Sql, schema: string, uuid: string): Promise<void> {
  if (!uuid) throw new Error('Invalid parameters');
  const user = await identityDb.selectUserByID(sql, schema, uuid);
  if (!user) return;
  await sendTemplate(
    env,
    {
      sender: { name: 'CubeCommons Password Change Confirmation', email: 'donotreply@cubecommons.ca' },
      to: [{ name: user.name, email: user.email }],
      templateId: brevoTemplateIdMapping.PASSWORD_CHANGE_CONFIRMATION,
      params: { NAME: `${user.name}` }
    },
    'Error sending password change confirmation email'
  );
}

export async function sendPasswordResetEmail(env: Env, sql: Sql, schema: string, email: string): Promise<void> {
  if (!email) throw new Error('Invalid parameters');
  const user = await identityDb.selectUserByEmail(sql, schema, email);
  if (!user) return;
  const resetToken = await signCubeJwt({ sub: encodeUuidBase36(user.id), aud: ['password-reset'] }, env.JWT_TOKEN_SECRET, '4h');
  await sendTemplate(
    env,
    {
      sender: { name: 'CubeCommons Password Reset', email: 'donotreply@cubecommons.ca' },
      to: [{ name: user.name, email: user.email }],
      templateId: brevoTemplateIdMapping.PASSWORD_RESET_EMAIL,
      params: {
        NAME: `${user.name}`,
        PASSWORD_CHANGE_URL: `${env.HOST}/reset-password/${resetToken}`
      }
    },
    'Error sending password change email'
  );
}

export async function sendContactUsEmail(env: Env, name: string, email: string, desc: string, ticketId: string): Promise<void> {
  if (!name || !email || !desc || !ticketId) throw new Error('Not all required fields have been provided');
  await sendTemplate(
    env,
    {
      sender: { name: 'CubeCommons Do Not Reply', email: 'donotreply@cubecommons.ca' },
      to: [{ email: env.CONTACT_US_EMAIL }],
      templateId: brevoTemplateIdMapping.CONTACT_US_EMAIL,
      params: { contactName: `${name}`, contactEmail: `${email}`, issueDesc: `${desc}`, ticketId: `${ticketId}` }
    },
    'Error sending contact us email'
  );
}

export async function sendReportAbuseEmail(
  env: Env,
  disputedUrl: string,
  requestType: string,
  contactName: string,
  contactEmail: string,
  issueDesc: string,
  ticketId: string
): Promise<void> {
  if (!disputedUrl || !requestType || !contactName || !contactEmail || !issueDesc || !ticketId) {
    throw new Error('Not all required fields have been provided');
  }
  await sendTemplate(
    env,
    {
      sender: { name: 'CubeCommons Do Not Reply', email: 'donotreply@cubecommons.ca' },
      to: [{ email: env.REPORT_ABUSE_EMAIL }],
      templateId: brevoTemplateIdMapping.REPORT_ABUSE_TEMPLATE,
      params: {
        URL: `${disputedUrl}`,
        requestType: `${requestType}`,
        contactName: `${contactName}`,
        contactEmail: `${contactEmail}`,
        issueDesc: `${issueDesc}`,
        ticketId: `${ticketId}`
      }
    },
    'Error sending report abuse email'
  );
}

/**
 * Parameter names match the old function. The route still calls it as
 * (name, email, organization, website, tag), so the template fields stay swapped
 * the same way they were on Cloud Run.
 */
export async function sendProfileRegistrationNotification(
  env: Env,
  organization: string,
  email: string,
  name: string,
  tag: string,
  website: string
): Promise<void> {
  if (!organization || !email || !name || !tag || !website) {
    throw new Error('Not all required fields have been provided');
  }
  await sendTemplate(
    env,
    {
      sender: { name: 'CubeCommons Do Not Reply', email: 'donotreply@cubecommons.ca' },
      to: [{ email: env.NOTIFICATION_EMAIL }],
      templateId: brevoTemplateIdMapping.NEW_PROFILE_REGISTRATION_NOTIFICATION,
      params: {
        organization: `${organization}`,
        email: `${email}`,
        name: `${name}`,
        tag: `${tag}`,
        website: `${website}`
      }
    },
    'Error sending profile registration notification email'
  );
}
