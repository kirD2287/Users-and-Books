import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'dj_pro98@mail.ru',
        pass: 'afKAmDSP2qm763tH9wbv',
    },
    logger: true,
    debug: true
});

export const sendConfirmationEmail = async (email: string, token: any) => {
    const mailOptions = {
        from: 'dj_pro98@mail.ru',
        to: email,
        subject: 'Email Confirmation',
        text: `Please confirm your email by clicking on the following link: http://localhost:3000/users/confirm/${token}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
