// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Brevo from '@getbrevo/brevo';
import * as settings from './settings';
import { brevoTemplateIdMapping } from './utils/utils';

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
