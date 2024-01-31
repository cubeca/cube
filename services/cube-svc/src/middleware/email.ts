// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Brevo from '@getbrevo/brevo';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UuidEncoder from 'uuid-encoder';

import * as db from '../db/queries/identity';
import * as jwt from 'jsonwebtoken';
import * as settings from '../settings';

import { brevoTemplateIdMapping } from '../utils/utils';

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
  apiKey.apiKey = settings.BREVO_API_KEY;

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
    EMAIL_VERIFICATION_URL: `${settings.CUBE_SVC_HOST}/auth/email/verify/${token}`
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
  apiKey.apiKey = settings.BREVO_API_KEY;

  const apiInstance = new Brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: 'CubeCommons Password Change Confirmation',
    email: 'donotreply@cubecommons.ca'
  };

  const user = await db.selectUserByID(uuid);

  if (user) {
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

  const user = await db.selectUserByEmail(email);

  if (user) {
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
    apiKey.apiKey = settings.BREVO_API_KEY;

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
      PASSWORD_CHANGE_URL: `${settings.HOST}/reset-password/${token}`
    };

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email sent successfully to: ' + email);
    } catch (error) {
      console.error('Error sending password change email:', error);
      throw new Error('Error sending password change email');
    }
  }
};

/**
 * Send an email when the contact us form is submitted.
 */
export const sendContactUsEmail = async (name: string, email: string, desc: string, ticketId: string) => {
  if (!name || !email || !desc || !ticketId) {
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
    contactName: `${name}`,
    contactEmail: `${email}`,
    issueDesc: `${desc}`,
    ticketId: `${ticketId}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Contact us email sent successfully');
  } catch (error) {
    console.error('Error sending contact us email:', error);
    throw new Error('Error sending contact us email');
  }
};

/**
 * Send an email letting an admin know someone is disputing an
 * uploaded content item.
 */
export const sendReportAbuseEmail = async (
  disputedUrl: string,
  requestType: string,
  contactName: string,
  contactEmail: string,
  issueDesc: string,
  ticketId: string
) => {
  if (!disputedUrl || !requestType || !contactName || !contactEmail || !issueDesc || !ticketId) {
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

  sendSmtpEmail.to = [{ email: settings.REPORT_ABUSE_EMAIL }];
  sendSmtpEmail.templateId = brevoTemplateIdMapping.REPORT_ABUSE_TEMPLATE;
  sendSmtpEmail.params = {
    URL: `${disputedUrl}`,
    requestType: `${requestType}`,
    contactName: `${contactName}`,
    contactEmail: `${contactEmail}`,
    issueDesc: `${issueDesc}`,
    ticketId: `${ticketId}`
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Report abuse email sent successfully');
  } catch (error) {
    console.error('Error sending report abuse email:', error);
    throw new Error('Error sending report abuse email');
  }
};