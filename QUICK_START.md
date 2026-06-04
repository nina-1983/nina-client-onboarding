# Quick Start — Nina Client Onboarding Form

## What I've Built For You

A complete Next.js app that's your form + Notion integration. Everything is ready to go.

---

## Step 1: Update `.env.local` With Your Token

The file is already created at `nina-client-onboarding/.env.local`

Replace this line:
```
NOTION_TOKEN=secret_YOUR_TOKEN_HERE
```

With your actual token from https://www.notion.so/my-integrations

Your `.env.local` should look like:
```
NOTION_TOKEN=secret_abc123def456...
NOTION_DB_ID=323c1adacbe780648916df44ef5a8465
```

✅ **The database ID is already in there (323c1adacbe780648916df44ef5a8465)**

---

## Step 2: Install & Run Locally

```bash
cd nina-client-onboarding
npm install
npm run dev
```

Visit http://localhost:3000

Fill out the form and submit.

**Check your Notion database** — the entry should appear instantly.

---

## Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "Add Nina client onboarding form"
git remote add origin https://github.com/YOUR_USERNAME/nina-client-onboarding.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. Click "Deploy"

**Then add environment variables:**
- In Vercel project settings → Environment Variables
- Add `NOTION_TOKEN` and `NOTION_DB_ID`

---

## What Changed vs Your Original HTML

✅ Your exact design — all animations, gradients, layout
✅ Same user experience — same buttons, messages, success state
❌ No longer a static HTML file — it's a real Next.js app
✅ **Saves directly to Notion** when someone submits

---

## Files You Might Want to Customize Later

- `app/page.jsx` — The form UI (styling, layout, copy)
- `app/api/submit/route.js` — The properties being saved (only if you change Notion database fields)
- `app/globals.css` — Global styling

---

## Your Project Structure

```
nina-client-onboarding/
├── app/
│   ├── page.jsx              ← Your form (customize styling here)
│   ├── api/submit/route.js   ← Notion integration (don't change unless needed)
│   ├── layout.jsx
│   └── globals.css
├── lib/
│   └── notion.js             ← Notion client (don't touch)
├── .env.local                ← YOUR TOKEN GOES HERE
├── .env.example
├── package.json
├── README.md
└── vercel.json
```

---

## Troubleshooting

**"Cannot find module"**
- Run `npm install` again

**Form submits but nothing in Notion**
- Check that `NOTION_TOKEN` is correct in `.env.local`
- Verify the integration has access to your database in Notion
- Check browser console (F12) for error messages

**"NOTION_DB_ID" is undefined**
- Make sure it's in `.env.local` and you've restarted `npm run dev`

---

**That's it. You're ready to go.** 🚀

Next steps:
1. Update `.env.local` with your token
2. Run locally and test
3. Push to GitHub and deploy to Vercel
