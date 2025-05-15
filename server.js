const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

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
  const { name, email, room, guests, checkin, checkout } = req.body;

  // Email transporter setup (use your real email/password in environment variables)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dotmotsuites@gmail.com", // Replace with your actual email
      pass: "etsj hifb lxpi jibc", // Use an App Password if using Gmail
    },
  });

  const mailOptions = {
    from: email,
    to: "dotmotsuites@gmail.com", // Hotel's receiving address
    subject: `New Booking Request from ${name}`,
    text: `
      Full Name: ${name}
      Email: ${email}
      Room Type: ${room}
      Guests: ${guests}
      Check-in Date: ${checkin}
      Check-out Date: ${checkout}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Booking submitted successfully." });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send booking email." });
  }
});

// Default route: Serve booking.html on GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "booking.html"));
  console.log(__dirname, __filename);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
