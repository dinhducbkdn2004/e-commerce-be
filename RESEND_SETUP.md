# 📧 Resend Email Integration Setup

## 🚀 Quick Setup

### 1. Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy the API key

### 2. Environment Variables

Add these to your `.env` file:

```env
# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_DOMAIN=yourdomain.com
FRONTEND_URL=http://localhost:5173
```

### 3. Domain Setup (Optional)

- For production, add your domain to Resend dashboard
- For development, you can use the default domain

## 📬 Email Features

### ✅ Implemented:

- **Email Verification** after registration
- **Welcome Email** after email verification
- **Password Reset** email with secure token
- **Beautiful React Email templates**

### 📧 Email Templates:

- `VerificationEmail.tsx` - BeeLuxe branded verification
- `PasswordResetEmail.tsx` - Password reset with security info
- `WelcomeEmail.tsx` - Simple welcome message

### 🔄 Email Flow:

```
Register → Verification Email → User Clicks → Welcome Email
Forgot Password → Reset Email → User Clicks → Password Reset
```

## 🧪 Testing

### Development:

```bash
# Start backend with email service
npm run dev

# Test registration - check logs for email sending
# Test password reset - check logs for email sending
```

### Production Checklist:

- [ ] Valid RESEND_API_KEY in production env
- [ ] RESEND_DOMAIN set to your domain
- [ ] FRONTEND_URL set to production URL
- [ ] Domain verified in Resend dashboard

## 📊 Free Tier Limits:

- **3,000 emails/month** free
- **100 emails/day** free
- Perfect for development and initial users

## 🔧 Troubleshooting:

### Email not sending?

1. Check `RESEND_API_KEY` is valid
2. Check logs for error messages
3. Verify domain in Resend dashboard
4. Check email service initialization

### Template not rendering?

1. Check React Email components installed
2. Verify template imports in emailService
3. Check render function usage

## 🎨 Customization:

### Add new email template:

1. Create new `.tsx` file in `src/shared/emails/templates/`
2. Use React Email components
3. Add method to `EmailService` class
4. Import and use in auth service

### Example:

```typescript
// In EmailService
async sendOrderConfirmation(email: string, order: Order) {
  const emailHtml = render(
    React.createElement(OrderConfirmationEmail, { order })
  )
  // ... send email
}
```
