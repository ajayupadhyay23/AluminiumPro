import { Resend } from 'resend'
import nodemailer from 'nodemailer'

const resend = new Resend(process.env.RESEND_API_KEY)

// Use your verified domain in production, or 'onboarding@resend.dev' for testing
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev'

// Set up Nodemailer for SMTP (like Gmail)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Helper to determine if we should use SMTP
const useSmtp = !!(process.env.SMTP_USER && process.env.SMTP_PASS)


export async function sendVerificationEmail(email: string, name: string, otp: string) {
  try {
    const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea;">
          
          <!-- Header -->
          <div style="background: #2B2B2B; padding: 32px 40px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; background: #D4A853; clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);"></div>
              <span style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">AluminiumPro</span>
            </div>
            <p style="color: #9CA3AF; margin: 8px 0 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Khalilabad, UP</p>
          </div>

          <!-- Body -->
          <div style="padding: 40px;">
            <h2 style="color: #2B2B2B; font-size: 22px; font-weight: 700; margin: 0 0 12px;">Verify your email address</h2>
            <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
              Hi <strong style="color: #2B2B2B;">${name}</strong>,<br/>
              Welcome to AluminiumPro! Use the verification code below to complete your registration. This code expires in <strong>15 minutes</strong>.
            </p>

            <!-- OTP Box -->
            <div style="background: #F9FAFB; border: 2px dashed #D4A853; border-radius: 12px; padding: 28px; text-align: center; margin: 0 0 28px;">
              <p style="color: #9CA3AF; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px; font-weight: 600;">Your One-Time Password</p>
              <div style="font-size: 44px; font-weight: 900; letter-spacing: 12px; color: #2B2B2B; font-family: 'Courier New', monospace;">${otp}</div>
            </div>

            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 0;">
              If you didn't create an account with AluminiumPro, you can safely ignore this email. Someone may have entered your email by mistake.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 20px 40px; border-top: 1px solid #eaeaea; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              AluminiumPro &bull; Khalilabad, Sant Kabir Nagar, UP &bull; <a href="mailto:shravanupadhyay54@gmail.com" style="color: #D4A853; text-decoration: none;">shravanupadhyay54@gmail.com</a>
            </p>
          </div>
        </div>
      `
    const subject = 'Your AluminiumPro Verification Code'

    if (useSmtp) {
      await transporter.sendMail({
        from: `AluminiumPro <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html,
      })
      console.log(`[Nodemailer] Verification email sent to ${email}`)
    } else {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      })

      if (error) {
        console.error('[Resend] Error sending verification email:', error)
        throw new Error(error.message)
      }
      console.log(`[Resend] Verification email sent to ${email}`)
    }

  } catch (err) {
    console.error('[Resend] Failed to send verification email:', err)
    throw err
  }
}

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
  try {
    const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea;">
          
          <!-- Header -->
          <div style="background: #2B2B2B; padding: 32px 40px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; background: #D4A853; clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);"></div>
              <span style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">AluminiumPro</span>
            </div>
          </div>

          <!-- Body -->
          <div style="padding: 40px;">
            <h2 style="color: #2B2B2B; font-size: 22px; font-weight: 700; margin: 0 0 12px;">Password Reset Request</h2>
            <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
              Hi <strong style="color: #2B2B2B;">${name}</strong>,<br/>
              We received a request to reset your AluminiumPro password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 0 0 28px;">
              <a href="${resetUrl}" style="display: inline-block; background: #D4A853; color: #2B2B2B; padding: 14px 32px; text-decoration: none; font-weight: 800; border-radius: 8px; font-size: 16px; letter-spacing: 0.3px;">
                Reset My Password
              </a>
            </div>

            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 0;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.<br/><br/>
              Or copy and paste this URL into your browser:<br/>
              <a href="${resetUrl}" style="color: #D4A853; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 20px 40px; border-top: 1px solid #eaeaea; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              AluminiumPro &bull; Khalilabad, Sant Kabir Nagar, UP
            </p>
          </div>
        </div>
      `
    const subject = 'Reset your AluminiumPro password'

    if (useSmtp) {
      await transporter.sendMail({
        from: `AluminiumPro <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html,
      })
      console.log(`[Nodemailer] Password reset email sent to ${email}`)
    } else {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html,
      })

      if (error) {
        console.error('[Resend] Error sending password reset email:', error)
        throw new Error(error.message)
      }
      console.log(`[Resend] Password reset email sent to ${email}`)
    }

  } catch (err) {
    console.error('[Resend] Failed to send password reset email:', err)
    throw err
  }
}

export async function sendOrderConfirmationEmail(email: string, name: string, order: any) {
  try {
    const itemRows = (order.items || []).map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #F3F4F6; color: #2B2B2B; font-size: 14px;">
          ${item.productName || item.product?.name || 'Product'}
          <span style="display: block; color: #9CA3AF; font-size: 12px;">${item.finishSelected} · ${item.qty} ${item.unit}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #F3F4F6; text-align: right; font-weight: 700; color: #2B2B2B; font-size: 14px;">
          ₹${Number(item.subtotal).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('')

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Confirmed — #${order.orderNumber} | AluminiumPro`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea;">

          <!-- Header -->
          <div style="background: #2B2B2B; padding: 32px 40px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; background: #D4A853; clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);"></div>
              <span style="color: #ffffff; font-size: 22px; font-weight: 800;">AluminiumPro</span>
            </div>
            <div style="margin-top: 16px; background: #D4A853; display: inline-block; padding: 6px 20px; border-radius: 99px;">
              <span style="color: #2B2B2B; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Order Confirmed ✓</span>
            </div>
          </div>

          <!-- Body -->
          <div style="padding: 36px 40px;">
            <h2 style="color: #2B2B2B; font-size: 20px; font-weight: 700; margin: 0 0 8px;">Thank you, ${name}!</h2>
            <p style="color: #6B7280; font-size: 15px; margin: 0 0 28px; line-height: 1.6;">
              Your order <strong style="color: #2B2B2B;">#${order.orderNumber}</strong> has been received and is being processed. We'll notify you when it ships.
            </p>

            <!-- Order Summary -->
            <div style="background: #F9FAFB; border-radius: 10px; padding: 24px; margin-bottom: 28px;">
              <p style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9CA3AF; margin: 0 0 16px;">Order Summary</p>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemRows}
              </table>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr>
                  <td style="font-size: 13px; color: #6B7280; padding: 4px 0;">Subtotal</td>
                  <td style="font-size: 13px; color: #6B7280; text-align: right; padding: 4px 0;">₹${Number(order.subtotal).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6B7280; padding: 4px 0;">GST</td>
                  <td style="font-size: 13px; color: #6B7280; text-align: right; padding: 4px 0;">₹${Number(order.gstAmount).toLocaleString('en-IN')}</td>
                </tr>
                ${order.discount > 0 ? `<tr><td style="font-size: 13px; color: #059669; padding: 4px 0;">Discount</td><td style="font-size: 13px; color: #059669; text-align: right; padding: 4px 0;">-₹${Number(order.discount).toLocaleString('en-IN')}</td></tr>` : ''}
                <tr>
                  <td style="font-size: 16px; font-weight: 800; color: #2B2B2B; padding: 12px 0 0;">Total</td>
                  <td style="font-size: 16px; font-weight: 800; color: #D4A853; text-align: right; padding: 12px 0 0;">₹${Number(order.total).toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 0;">
              Questions? Reply to this email or call us at <a href="tel:+919876543210" style="color: #D4A853;">+91 98765 43210</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 20px 40px; border-top: 1px solid #eaeaea; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              AluminiumPro &bull; Khalilabad, Sant Kabir Nagar, UP &bull;
              <a href="mailto:shravanupadhyay54@gmail.com" style="color: #D4A853; text-decoration: none;">shravanupadhyay54@gmail.com</a>
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Resend] Error sending order confirmation email:', error)
      throw new Error(error.message)
    }

    console.log(`[Resend] Order confirmation sent to ${email} for order ${order.orderNumber}`)
  } catch (err) {
    console.error('[Resend] Failed to send order confirmation email:', err)
    throw err
  }
}

const STATUS_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  PLACED:     { label: 'Order Placed',    color: '#6366F1', emoji: '📦' },
  CONFIRMED:  { label: 'Confirmed',       color: '#0EA5E9', emoji: '✅' },
  PROCESSING: { label: 'Processing',      color: '#F59E0B', emoji: '⚙️' },
  PACKED:     { label: 'Packed',          color: '#F59E0B', emoji: '📫' },
  DISPATCHED: { label: 'Dispatched',      color: '#8B5CF6', emoji: '🚚' },
  IN_TRANSIT: { label: 'In Transit',      color: '#D4A853', emoji: '🛣️' },
  DELIVERED:  { label: 'Delivered',       color: '#10B981', emoji: '🎉' },
  CANCELLED:  { label: 'Cancelled',       color: '#EF4444', emoji: '❌' },
  REFUNDED:   { label: 'Refunded',        color: '#6B7280', emoji: '↩️' },
}

export async function sendOrderStatusEmail(email: string, name: string, order: any, newStatus: string) {
  try {
    const statusInfo = STATUS_LABELS[newStatus] || { label: newStatus, color: '#6B7280', emoji: '📋' }

    const trackingSection = (order.trackingNumber && newStatus !== 'CANCELLED') ? `
      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <p style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #059669; margin: 0 0 8px;">Tracking Info</p>
        <p style="font-size: 14px; color: #2B2B2B; margin: 0;"><strong>Courier:</strong> ${order.courierName || 'Standard Delivery'}</p>
        <p style="font-size: 14px; color: #2B2B2B; margin: 6px 0 0;"><strong>Tracking #:</strong> ${order.trackingNumber}</p>
        ${order.trackingUrl ? `<a href="${order.trackingUrl}" style="display: inline-block; margin-top: 12px; background: #059669; color: white; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 700; text-decoration: none;">Track Your Order →</a>` : ''}
      </div>
    ` : ''

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${statusInfo.emoji} Order #${order.orderNumber} — ${statusInfo.label} | AluminiumPro`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #eaeaea;">

          <!-- Header -->
          <div style="background: #2B2B2B; padding: 32px 40px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              <div style="width: 32px; height: 32px; background: #D4A853; clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%);"></div>
              <span style="color: #ffffff; font-size: 22px; font-weight: 800;">AluminiumPro</span>
            </div>
            <div style="background: ${statusInfo.color}; display: inline-block; padding: 6px 20px; border-radius: 99px;">
              <span style="color: #ffffff; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">${statusInfo.emoji} ${statusInfo.label}</span>
            </div>
          </div>

          <!-- Body -->
          <div style="padding: 36px 40px;">
            <h2 style="color: #2B2B2B; font-size: 20px; font-weight: 700; margin: 0 0 8px;">Hi ${name},</h2>
            <p style="color: #6B7280; font-size: 15px; margin: 0 0 28px; line-height: 1.6;">
              Your order <strong style="color: #2B2B2B;">#${order.orderNumber}</strong> status has been updated to
              <strong style="color: ${statusInfo.color};">${statusInfo.label}</strong>.
            </p>

            ${trackingSection}

            <div style="background: #F9FAFB; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="font-size: 13px; color: #6B7280; padding: 6px 0;">Order Number</td>
                  <td style="font-size: 13px; font-weight: 700; color: #2B2B2B; text-align: right;">#${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6B7280; padding: 6px 0;">Order Total</td>
                  <td style="font-size: 13px; font-weight: 700; color: #2B2B2B; text-align: right;">₹${Number(order.total).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #6B7280; padding: 6px 0;">Current Status</td>
                  <td style="text-align: right;"><span style="background: ${statusInfo.color}22; color: ${statusInfo.color}; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 700;">${statusInfo.label}</span></td>
                </tr>
              </table>
            </div>

            <p style="color: #9CA3AF; font-size: 13px; line-height: 1.6; margin: 0;">
              Need help? Contact us at <a href="mailto:shravanupadhyay54@gmail.com" style="color: #D4A853;">shravanupadhyay54@gmail.com</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F9FAFB; padding: 20px 40px; border-top: 1px solid #eaeaea; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              AluminiumPro &bull; Khalilabad, Sant Kabir Nagar, UP &bull;
              <a href="mailto:shravanupadhyay54@gmail.com" style="color: #D4A853; text-decoration: none;">shravanupadhyay54@gmail.com</a>
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Resend] Error sending order status email:', error)
      throw new Error(error.message)
    }

    console.log(`[Resend] Order status email (${newStatus}) sent to ${email}`)
  } catch (err) {
    console.error('[Resend] Failed to send order status email:', err)
    throw err
  }
}
