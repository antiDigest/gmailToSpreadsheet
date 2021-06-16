global.sendmail = () => {
  const email = Session.getActiveUser().getEmail();

  const TUTORIAL = '';

  const htmlBody = `
    <p>This email was sent using the <a href="${TUTORIAL}"></a></p>
    <p>For assistance, please contact <a href="https://twitter.com/AntiDigestWFH">@AntiDigest</a></p>
  `;

  const textBody = htmlBody.replace(/<[^>]+>/g, ' ');

  GmailApp.sendEmail(email, 'Hello from Google Apps Script', textBody, {
    htmlBody,
  });

  // eslint-disable-next-line no-console
  console.log('Email message sent to', email);
};
