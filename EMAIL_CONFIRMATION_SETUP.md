# Email Confirmation Setup Guide

Your RecipeShare app now has a complete email confirmation flow!

## ✅ What's Been Implemented

1. **Email Confirmation Page** (`/auth/confirm-email`)
   - Shows after signup
   - Explains the confirmation process
   - Provides step-by-step instructions

2. **Callback Handler** (`/auth/callback`)
   - Processes email confirmation links
   - Exchanges code for session
   - Redirects to feed after confirmation

3. **Login Validation**
   - Checks if email is confirmed before allowing login
   - Shows helpful error message if not confirmed

4. **Success Page** (`/auth/confirmed`)
   - Optional confirmation success page

---

## 🔧 Required Supabase Configuration

You need to configure your Supabase project to allow the callback URL:

### Step 1: Add Redirect URL in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   ```
5. Click **Save**

### Step 2: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the "Confirm signup" email template if desired
3. The default template will work fine

---

## 🧪 How to Test

### Test Signup Flow:

1. **Visit** `http://localhost:3000`
2. **Click "Sign Up"**
3. **Fill in the form** and submit
4. **You'll see** the email confirmation page
5. **Check your email** for the confirmation link
6. **Click the link** in the email
7. **You'll be redirected** to `/feed` automatically

### Test Login with Unconfirmed Email:

1. Try to login before confirming email
2. You'll see: "Please verify your email address before signing in"

### Test Login After Confirmation:

1. Click the confirmation link in your email
2. Return to homepage
3. Click "Log In"
4. Enter your credentials
5. You'll be redirected to `/feed`

---

## 🌐 Production Setup

When deploying to production, you'll need to:

1. **Update `.env.local`** (or environment variables in your hosting platform):
   ```env
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

2. **Add production URL in Supabase**:
   - Go to **Authentication** → **URL Configuration**
   - Add: `https://yourdomain.com/auth/callback`

---

## 📧 Email Provider Configuration

By default, Supabase uses their email service with rate limits:
- **Development**: 4 emails per hour
- **Production**: Consider using a custom SMTP provider

### To use custom SMTP (Optional):

1. Go to **Settings** → **Authentication**
2. Scroll to **SMTP Settings**
3. Configure your email provider (SendGrid, AWS SES, etc.)

---

## 🔍 Troubleshooting

### Email not arriving?

1. **Check spam folder**
2. **Wait a few minutes** - can take up to 5 minutes
3. **Check Supabase logs**: Dashboard → Logs → Auth Logs
4. **Verify email configuration** in Supabase settings

### "Email not confirmed" error?

1. Make sure you clicked the link in the email
2. Check if the link expired (24 hours validity)
3. Try signing up again with a different email

### Redirect not working?

1. Verify `http://localhost:3000/auth/callback` is in Supabase redirect URLs
2. Check your `.env.local` has `NEXT_PUBLIC_SITE_URL` set
3. Restart your dev server after updating env variables

---

## 🎯 User Flow Summary

```
Sign Up → Confirm Email Page → Check Email → Click Link → Callback Handler → Feed Page
                                                                    ↓
                                                            Email Confirmed!
```

---

## ✨ Features

✅ User receives confirmation email after signup  
✅ Clear instructions on confirmation page  
✅ Email verification required before login  
✅ Automatic redirect after email confirmation  
✅ Helpful error messages for unconfirmed emails  
✅ Works in both development and production  

---

## 📝 Notes

- Email confirmation links are valid for **24 hours**
- Users cannot login until email is confirmed
- Confirmation is handled automatically by Supabase
- The callback route processes the confirmation seamlessly

Happy coding! 🚀
