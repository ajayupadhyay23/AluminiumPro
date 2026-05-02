import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'upadhyayajay2235@gmail.com',
    subject: 'Test Delivery',
    html: '<p>Testing Delivery from Resend to your verified email!</p>'
  });
  console.log({ data, error });
}
test();
