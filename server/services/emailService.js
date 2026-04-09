import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP email for password reset
export const sendPasswordResetOTP = async (email, otp) => {
  const mailOptions = {
    from: {
      name: 'IntelliFit',
      address: process.env.EMAIL,
    },
    to: email,
    subject: 'Password Reset OTP - IntelliFit',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background: #f3f4f6;
            padding: 20px;
          }
          .email-container {
            max-width: 480px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            border: 2px solid #e5e7eb;
          }
          .header {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            padding: 35px 30px;
            text-align: center;
          }
          .logo {
            width: 65px;
            height: 65px;
            margin: 0 auto 12px;
            background: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .brand-name {
            font-size: 26px;
            font-weight: 700;
            color: white;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 30px 25px;
            background: white;
          }
          .greeting {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 14px;
            color: #1f2937;
          }
          .message {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 18px;
            color: #6b7280;
          }
          .otp-container {
            text-align: center;
            margin: 25px 0;
            padding: 22px;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            border-radius: 14px;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }
          .otp-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: white;
            letter-spacing: 6px;
            font-family: 'Courier New', monospace;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .otp-validity {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.85);
            margin-top: 8px;
          }
          .warning {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            padding: 14px;
            border-radius: 12px;
            font-size: 12px;
            margin-top: 20px;
            border-left: 4px solid #f59e0b;
            color: #78350f;
          }
          .warning strong {
            display: block;
            margin-bottom: 5px;
            font-size: 13px;
          }
          .footer {
            background: #f9fafb;
            padding: 20px 25px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          .footer-text {
            font-size: 12px;
            color: #6b7280;
            margin: 6px 0;
          }
          .footer-links {
            margin-top: 10px;
          }
          .footer-links a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 6px;
            font-size: 11px;
            font-weight: 500;
          }
          .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 18px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">💪</div>
            <h1 class="brand-name">IntelliFit</h1>
          </div>
          
          <div class="content">
            <div class="greeting">Hello! 👋</div>
            
            <div class="message">
              We received a request to reset your password for your IntelliFit account. 
              Use the OTP below to reset your password.
            </div>
            
            <div class="otp-container">
              <div class="otp-label">Your OTP Code</div>
              <div class="otp-code">${otp}</div>
              <div class="otp-validity">⏱️ Valid for 10 minutes</div>
            </div>
            
            <div class="message">
              Enter this OTP in the password reset form to create your new password.
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice</strong>
              If you didn't request this password reset, please ignore this email. 
              Your password will remain unchanged and your account is secure.
              Never share this OTP with anyone!
            </div>
            
            <div class="divider"></div>
            
            <div class="message" style="font-size: 12px; color: #9ca3af; text-align: center;">
              This OTP will expire in 10 minutes for your security.
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text">Stay fit, stay healthy! 💪</p>
            <p class="footer-text">© 2024 IntelliFit. All rights reserved.</p>
            <div class="footer-links">
              <a href="#">Privacy Policy</a> | 
              <a href="#">Terms of Service</a> | 
              <a href="#">Contact Support</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset OTP sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send password reset OTP');
  }
};

// Test email configuration
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
};
