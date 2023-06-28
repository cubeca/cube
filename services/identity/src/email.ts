import Brevo from '@getbrevo/brevo';
import UuidEncoder from 'uuid-encoder';
import * as db from './db/queries';
import * as jwt from 'jsonwebtoken';
import * as settings from './settings';

/**
 * Send a verification email using the preconfigured Brevo template #2.
 */
export const sendVerificationEmail = async (name: string, email: string, token: string) => {
  if (!name || !email || !token) {
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

  sendSmtpEmail.to = [{ name: name, email: email }];
  sendSmtpEmail.templateId = 2;
  sendSmtpEmail.params = {
    NAME: `${name}`,
    EMAIL_VERIFICATION_URL: `${process.env.HOST}:${process.env.PORT}/auth/email/verify/${token}`
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
  sendSmtpEmail.templateId = 3;
  sendSmtpEmail.params = {
    NAME: `${user.name}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully to: ' + user.email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
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
  const encodedUuid = encoder.encode(user.uuid);

  const token = jwt.sign(
    {
      iss: 'CUBE',
      sub: encodedUuid,
      aud: ['cube-password-reset']
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
  sendSmtpEmail.templateId = 4;
  sendSmtpEmail.params = {
    NAME: `${user.name}`,
    EMAIL_VERIFICATION_URL: `${process.env.HOST}:${process.env.PORT}/somewebformincubeui/${token}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully to: ' + email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
};
