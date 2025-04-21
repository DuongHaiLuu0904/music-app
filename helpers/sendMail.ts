import nodeMailer from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const sendMail = async (email: string, subject: string, html: string): Promise<void> => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASS as string
        }
    });

    const mailOptions: MailOptions = {
        from: process.env.EMAIL_USER as string,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};