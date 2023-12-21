// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Brevo from '@getbrevo/brevo';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UuidEncoder from 'uuid-encoder';

import * as db from './db/queries';
import * as jwt from 'jsonwebtoken';
import * as settings from './settings';

import { brevoTemplateIdMapping } from './utils';

/**
 * Send a verification email using the preconfigured Brevo template #2.
 */
export const sendVerificationEmail = async (name: string, email: string, token: string) => {
  if (!email || !token) {
    //name isn't required as the Brevo template can have default values
    throw new Error('Invalid parameters');
  }

  const defaultClient = Brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new Brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: 'CubeCommons Email Verification',
    email: 'donotreply@cubecommons.ca'
  };

  sendSmtpEmail.to = [{ name: name ? name : 'CubeCommons User', email: email }];
  sendSmtpEmail.templateId = brevoTemplateIdMapping.SEND_VERIFICATION_EMAIL;
  sendSmtpEmail.params = {
    NAME: `${name}`,
    EMAIL_VERIFICATION_URL: `${process.env.BFF_HOST}/auth/email/verify/${token}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully to: ' + email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
};

/**
 * Send a notification email letting the user know their password has been updated.
 */
export const sendPasswordChangeConfirmation = async (uuid: string) => {
  if (!uuid) {
    throw new Error('Invalid parameters');
  }

  const defaultClient = Brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new Brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: 'CubeCommons Password Change Confirmation',
    email: 'donotreply@cubecommons.ca'
  };

  const r = await db.selectUserByID(uuid);
  const user = r.rows[0];

  sendSmtpEmail.to = [{ name: user.name, email: user.email }];
  sendSmtpEmail.templateId = brevoTemplateIdMapping.PASSWORD_CHANGE_CONFIRMATION;
  sendSmtpEmail.params = {
    NAME: `${user.name}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully to: ' + user.email);
  } catch (error) {
    console.error('Error sending password change confirmation email:', error);
    throw new Error('Error sending password change confirmation email');
  }
};

/**
 * Send an email containing a link for a password reset of an unauthenticated user.
 * This uses Brevo template #4.
 */
export const sendPasswordResetEmail = async (email: string) => {
  if (!email) {
    throw new Error('Invalid parameters');
  }

  const r = await db.selectUserByEmail(email);
  const user = r.rows[0];

  const encoder = new UuidEncoder('base36');
  const encodedUuid = encoder.encode(user.id);

  const token = jwt.sign(
    {
      iss: 'CUBE',
      sub: encodedUuid,
      aud: ['password-reset']
    },
    settings.JWT_TOKEN_SECRET,
    { expiresIn: '4h' }
  );

  const defaultClient = Brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new Brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: 'CubeCommons Password Reset',
    email: 'donotreply@cubecommons.ca'
  };

  sendSmtpEmail.to = [{ name: user.name, email: user.email }];
  sendSmtpEmail.templateId = brevoTemplateIdMapping.PASSWORD_RESET_EMAIL;
  sendSmtpEmail.params = {
    NAME: `${user.name}`,
    PASSWORD_CHANGE_URL: `${process.env.HOST}/reset-password/${token}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully to: ' + email);
  } catch (error) {
    console.error('Error sending password change email:', error);
    throw new Error('Error sending password change email');
  }
};

/**
 * Send an email when the contact us form is submitted.
 */
export const sendContactUsEmail = async (name: string, email: string, desc: string) => {
  if (!name || !email || !desc) {
    throw new Error('Not all required fields have been provided');
  }

  const defaultClient = Brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = settings.BREVO_API_KEY;

  const apiInstance = new Brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: 'CubeCommons Do Not Reply',
    email: 'donotreply@cubecommons.ca'
  };

  sendSmtpEmail.to = [{ email: settings.CONTACT_US_EMAIL }];
  sendSmtpEmail.templateId = brevoTemplateIdMapping.CONTACT_US_EMAIL;
  sendSmtpEmail.params = {
    name: `${name}`,
    email: `${email}`,
    desc: `${desc}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Contact us email sent successfully');
  } catch (error) {
    console.error('Error sending contact us email:', error);
    throw new Error('Error sending contact us email');
  }
};
