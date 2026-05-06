import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

async function test() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node test-email.mjs your-email@example.com');
    process.exit(1);
  }

  console.log(`Attempting to send test email to ${email} from ${FROM_EMAIL}...`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Test Email from AluminiumPro',
      html: '<p>If you see this, email sending is working!</p>',
    });

    if (error) {
      console.error('Error from Resend:', error);
    } else {
      console.log('Success! Data:', data);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

test();
