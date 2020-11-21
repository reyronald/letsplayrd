// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sgMail, { MailDataRequired } from '@sendgrid/mail'

sgMail.setApiKey(process.env.LETSPLAYRD_SENDGRID_API_KEY ?? '')

export default async function sendEmail(req: any, res: any) {
  try {
    const msg: MailDataRequired = {
      to: req.body.email,
      from: process.env.LETSPLAYRD_SENDGRID_VERIFIED_SENDER ?? '',
      subject: "Let's Play RD",
      text: 'Hello 😃!',
      html: '<strong>Hello 😃!</strong>',
    }
    await sgMail.send(msg)
    res.statusCode = 204
    res.end()
  } catch (error) {
    console.error({ error })
    res.statusCode = 500
    if (process.env.NODE_ENV === 'development') {
      res.json({ message: 'failed', error: { message: error.message } })
    } else {
      res.json({ message: 'failed' })
    }
  }
}
