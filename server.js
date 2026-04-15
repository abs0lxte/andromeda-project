const path = require('path');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function createMailTransporter() {
  if (!process.env.SMTP_HOST || !process.env.FROM_EMAIL) {
    throw new Error('SMTP_HOST and FROM_EMAIL must be configured in .env');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined
  });

  return transporter;
}

function createTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return null;
  }
  return Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const twilioClient = createTwilioClient();
const smsFromNumber = process.env.TWILIO_FROM_NUMBER || '';

app.get('/api/config', (req, res) => {
  res.json({
    emailFrom: process.env.FROM_EMAIL || null,
    smsFrom: smsFromNumber || null
  });
});

app.post('/api/send-email', async (req, res) => {
  const { recipient, subject, body, alias } = req.body;

  if (!recipient || !subject || !body) {
    return res.status(400).json({ error: 'recipient, subject, and body are required.' });
  }

  try {
    const transporter = createMailTransporter();
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: recipient,
      subject,
      text: body,
      replyTo: alias || process.env.FROM_EMAIL
    });

    return res.json({ message: 'Email sent successfully.', messageId: info.messageId });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email.', detail: error.message });
  }
});

app.post('/api/send-sms', async (req, res) => {
  if (!twilioClient || !smsFromNumber) {
    return res.status(500).json({ error: 'SMS gateway is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.' });
  }

  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ error: 'to and body are required.' });
  }

  try {
    const message = await twilioClient.messages.create({
      body,
      from: smsFromNumber,
      to
    });

    return res.json({ message: 'SMS sent successfully.', sid: message.sid });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send SMS.', detail: error.message });
  }
});

const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, () => {
  console.log(`Andromeda server running on http://localhost:${port}`);
});
