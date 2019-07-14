import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'anthwinter@gmail.com',
    subject: 'Welcome to Task Manager',
    text: `Welcome to the app ${name}.`,
  })
}

export const sendDeleteEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'anthwinter@gmail.com',
    subject: 'Sorry to see you go!',
    text: `We'd love to have you back some time, ${name}.`,
  })
}