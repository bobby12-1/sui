// booking-backend/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure your email transport (using Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dotmotsuites@gmail.com',      // <-- replace with your Gmail address
    pass: 'etsj hifb lxpi jibc'          // <-- replace with your Gmail App Password
  }
});

// Booking endpoint - only handles bank transfer
app.post('/api/book', async (req, res) => {
  const { name, email, room, guests, checkin, checkout } = req.body;

  const reference = `REF-${Date.now()}`;
  const amount = 25000; // You can adjust or calculate based on room/guests

  const message = `
    Hello ${name},

    Thank you for booking with Dotmot Hotel and Suites.

    Please make a bank transfer of NGN ${amount} to the following account:

    Bank: Moniepoint  
    Account Number: 5953721520  
    Account Name: Dotmot Hotel and Suites  

    Booking Reference: ${reference}

    After payment, reply to this email with your payment proof.

    Booking Details:
    Room Type: ${room}  
    Number of Guests: ${guests}  
    Check-in Date: ${checkin}  
    Check-out Date: ${checkout}

    We look forward to hosting you!

    - Dotmot Hotel & Suites
  `;

  try {
    await transporter.sendMail({
      from: 'dotmotsuites@gmail.com',
      to: email,
      subject: 'Bank Transfer Instructions - Dotmot Hotel',
      text: message
    });

    res.json({ status: 'success', message: 'Bank transfer instructions sent to email.' });
  } catch (err) {
    console.error('Email send failed:', err);
    res.status(500).json({ error: 'Failed to send bank transfer instructions' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
