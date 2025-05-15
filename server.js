const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Booking route
app.post("/api/book", async (req, res) => {
  const { name, email, room, guests, checkin, checkout, paymentMethod, reference } = req.body;

  // Email transporter setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dotmotsuites@gmail.com",
      pass: "etsj hifb lxpi jibc" // App password (safe for now, but should use env vars)
    }
  });

  // 1. Email to Hotel Admin
  const adminMailOptions = {
    from: "dotmotsuites@gmail.com",
    to: "dotmotsuites@gmail.com", // Admin's own inbox
    subject: `📬 New Booking from ${name}`,
    text: `
      You received a new booking:

      Name: ${name}
      Email: ${email}
      Room Type: ${room}
      Guests: ${guests}
      Check-in: ${checkin}
      Check-out: ${checkout}
      Payment Method: ${paymentMethod}
      Reference: ${reference || 'N/A'}
    `
  };

  // 2. Confirmation Email to Guest (Optional but nice)
  const guestMailOptions = {
    from: "dotmotsuites@gmail.com",
    to: email,
    subject: "✅ Booking Confirmation - Dotmot Hotel",
    text: `
      Dear ${name},

      Thank you for booking with Dotmot Hotel & Suites!

      Here are your booking details:
      Room Type: ${room}
      Guests: ${guests}
      Check-in: ${checkin}
      Check-out: ${checkout}
      Payment Method: ${paymentMethod}
      Reference: ${reference || 'BANK_TRANSFER'}

      We look forward to hosting you!

      - Dotmot Hotel & Suites
    `
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(guestMailOptions); // optional, you can comment this out if not needed
    res.status(200).json({ success: true, message: "Booking email sent to admin and guest." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});
