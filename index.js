require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Email route
app.post('/send-email', async (req, res) => {
    const { name, email, message, subject, phone } = req.body;

    // Gmail transporter setup
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASS // Use App Password
        }
    });

    let mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: `New message from ${name}`,
        text: message,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Subject:</strong> ${subject}</p>
               <p><strong>Phone:</strong> ${phone}</p>
               <p><strong>Message:</strong><br>${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Email failed to send.' });
    }
});


app.post('/book-call', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'New Consultation Call Request',
        text: `A user has requested a consultation call. Phone Number: ${phone}`,
        html: `<p><strong>Phone Number:</strong> ${phone}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Consultation request sent!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to send request.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running`);
});
