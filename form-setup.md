# Contact Form Setup Guide

## Quick Setup with Web3Forms (Recommended)

1. **Go to [Web3Forms.com](https://web3forms.com)**
2. **Enter your email address**
3. **Click "Get Access Key"**
4. **Copy your access key**
5. **Replace `YOUR_ACCESS_KEY_HERE` in script.js with your actual key**

That's it! Your form will work immediately.

## Alternative Options

### Option 1: Formspree

1. Go to [Formspree.io](https://formspree.io)
2. Sign up for a free account
3. Create a new form
4. Copy your form endpoint URL
5. Replace the fetch URL in script.js

### Option 2: EmailJS

1. Go to [EmailJS.com](https://www.emailjs.com)
2. Sign up for a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Get your service ID, template ID, and public key
5. Replace the fetch code with EmailJS code

### Option 3: Netlify Forms (If hosting on Netlify)

1. Add `netlify` attribute to your form
2. No backend code needed - Netlify handles it automatically

## Current Setup

The form is currently configured to use Web3Forms. You just need to:

1. Get your access key from Web3Forms.com
2. Replace `YOUR_ACCESS_KEY_HERE` in script.js (line 119)
3. Test the form

## Features Included

- ✅ Loading state while sending
- ✅ Success/error notifications
- ✅ Form validation
- ✅ Email delivery to your inbox
- ✅ Spam protection
- ✅ No monthly limits (Web3Forms)
