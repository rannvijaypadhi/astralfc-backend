const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/send', async (req, res) => {
  const { name, email, age, inquiry, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Astral FC Website" <${process.env.GMAIL_USER}>`,
    to: 'rannvijaypadhi@gmail.com',
    replyTo: email,
    subject: `Astral FC – ${inquiry || 'General Inquiry'} from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 2px solid #f5c518; border-radius: 10px; overflow: hidden;">
        <div style="background: #1a3a6b; padding: 20px; text-align: center;">
          <h1 style="color: #f5c518; margin: 0;">⭐ Astral FC</h1>
          <p style="color: white; margin: 5px 0;">New Contact Form Submission</p>
        </div>
        <div style="padding: 24px; background: #fff;">
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #1a3a6b; width: 130px;">Name</td><td style="padding: 8px;">${name}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #1a3a6b;">Email</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #1a3a6b;">Age</td><td style="padding: 8px;">${age || 'Not provided'}</td></tr>
            <tr style="background:#f9f9f9;"><td style="padding: 8px; font-weight: bold; color: #1a3a6b;">Inquiry Type</td><td style="padding: 8px;">${inquiry || 'General Inquiry'}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #1a3a6b; vertical-align: top;">Message</td><td style="padding: 8px;">${message.replace(/\n/g, '<br>')}</td></tr>
          </table>
        </div>
        <div style="background: #1a3a6b; padding: 12px; text-align: center;">
          <p style="color: #f5c518; margin: 0; font-size: 12px;">© 2026 Astral FC — Passion. Experience. Community.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

app.get('/', (req, res) => res.json({ status: 'Astral FC email server is running ⭐' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
