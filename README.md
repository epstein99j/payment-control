# Payment Control Module - Google Cloud Deployment

A real-time payment control system for FedNow & RTP, built with React + Tailwind CSS.

## Quick Deploy (5 minutes)

### Prerequisites
- [Node.js 18+](https://nodejs.org/) installed
- Google account for Firebase

### Step-by-Step Instructions

#### 1. Open Terminal and Navigate to This Folder
```bash
cd payment-control-deploy
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

#### 4. Login to Firebase
```bash
firebase login
```
This opens a browser window - sign in with your Google account.

#### 5. Create a New Firebase Project
```bash
firebase projects:create payment-control-app
```
- If that name is taken, try: `payment-control-app-12345` (add random numbers)
- Say **Yes** when asked to set up billing (it's free for small projects)

#### 6. Connect This Folder to Your Project
```bash
firebase use payment-control-app
```
(Use whatever project name you created in step 5)

#### 7. Build the App
```bash
npm run build
```

#### 8. Deploy!
```bash
firebase deploy
```

#### 9. Done! 🎉
Firebase will output your URL:
```
✔ Hosting URL: https://payment-control-app.web.app
```

---

## Alternative: One-Command Deploy

After steps 1-6, you can just run:
```bash
npm run deploy
```
This builds and deploys in one step.

---

## Local Development

To run locally before deploying:
```bash
npm run dev
```
Opens at http://localhost:5173

---

## Project Structure

```
payment-control-deploy/
├── src/
│   ├── PaymentControlModule.jsx   # Main application
│   ├── App.jsx                    # App wrapper
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind CSS
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite bundler config
├── tailwind.config.js             # Tailwind config
├── firebase.json                  # Firebase hosting config
└── README.md                      # This file
```

---

## Updating the App

After making changes:
```bash
npm run deploy
```

---

## Custom Domain (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Hosting → Add custom domain
4. Follow the DNS verification steps

---

## Costs

Firebase Hosting free tier includes:
- 10 GB storage
- 360 MB/day data transfer
- SSL certificate included
- Global CDN

This is more than enough for a demo/internal tool.

---

## Troubleshooting

**"Permission denied" errors:**
```bash
firebase login --reauth
```

**"Project not found" errors:**
```bash
firebase projects:list
firebase use <your-project-id>
```

**Build errors:**
```bash
rm -rf node_modules
npm install
npm run build
```

---

## Need Help?

- [Firebase Docs](https://firebase.google.com/docs/hosting)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
