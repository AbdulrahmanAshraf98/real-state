const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create transporter > service will send email (email)
  const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});
  try {
		if (process.env.NODE_ENV === "production") {
			// Sendgrid
			transporter = nodemailer.createTransport({
				service: "SendGrid",
				auth: {
					user: process.env.SENDGRID_USERNAME,
					pass: process.env.SENDGRID_PASSWORD,
				},
			});
		}

		const mailOptions = {
			from: `<${process.env.EMAIL_NAME} <${process.env.EMAIL_USERNAME}>`, // sender address
			to: options.email, // list of receivers
			subject: options.subject, // Subject line
			text: options.text, // plain text body
			html: options.html,
		};
		let info = await transporter.sendMail(mailOptions);
	} catch (error) {
		throw new Error(error);
	}

};
module.exports = sendEmail;
