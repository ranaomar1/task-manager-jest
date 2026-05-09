// ============================================================
// notificationService.js - Sends notifications (email/SMS)
// ============================================================

/**
 * Sends an email notification
 * @param {string} to
 * @param {string} subject
 * @param {string} body
 * @returns {Promise<Object>}
 */
async function sendEmail(to, subject, body) {
  // Simulates calling an external email API
  if (!to || !subject) throw new Error('Missing email parameters');
  console.log(`Sending email to ${to}: ${subject}`);
  return { success: true, messageId: `msg_${Date.now()}` };
}

/**
 * Sends an SMS notification
 * @param {string} phone
 * @param {string} message
 * @returns {Promise<Object>}
 */
async function sendSMS(phone, message) {
  if (!phone || !message) throw new Error('Missing SMS parameters');
  console.log(`Sending SMS to ${phone}: ${message}`);
  return { success: true, sid: `sms_${Date.now()}` };
}

module.exports = { sendEmail, sendSMS };
