const nodemailer = require('nodemailer');

const sendMail = async (req, res) => {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'angelina82@ethereal.email',
            pass: '5THKNBe4w3uG6ygnCA'
        }
    });

    let message = await transporter.sendMail({
        from: '"Durgesh Bisen" <durgesh.bisen10102@gmail.com>',
        to: "webdev.durgesh@gmail.com",
        subject: "Hello Durgesh", 
        text: "Hello Durgesh", 
        html: "<b>Hello world?</b>",
    });
    console.log("Message sent: %s", message.messageId);

    res.json(message);
};

module.exports = sendMail;