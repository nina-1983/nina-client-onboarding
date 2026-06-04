# Nina Client Onboarding Form

A Next.js form that saves client onboarding data directly to your Notion workspace.

## Setup

### 1. Add Your Notion Token

1. Copy `.env.example` to `.env.local`
2. Replace `secret_YOUR_TOKEN_HERE` with your actual Notion Integration Secret
   - Go to https://www.notion.so/my-integrations
   - Find your integration
   - Copy the "Internal Integration Token"

Your `.env.local` should look like:
```
NOTION_TOKEN=secret_abc123xyz...
NOTION_DB_ID=323c1adacbe780648916df44ef5a8465
```

⚠️ **Never commit `.env.local` to GitHub** — it contains your secret token.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Fill out the form and submit. Check your Notion database — the entry should appear immediately.

## How It Works

- **Frontend**: React form component (`app/page.jsx`) with your design
- **Backend**: Next.js API route (`app/api/submit/route.js`) that sends data to Notion
- **Connection**: Notion client (`lib/notion.js`) handles authentication and property mapping

When someone submits the form:
1. Form data is sent to `/api/submit`
2. API route transforms it into Notion property format
3. Page is created in your "Client Onboarding" database
4. Success message is shown to the user

## Customizing

### Change Form Fields

Edit the `data` state in `app/page.jsx`:

```javascript
const [data, setData] = useState({
  name: "",
  email: "",
  // Add or remove fields here
});
```

Then update the API route (`app/api/submit/route.js`) to match:

```javascript
const properties = {
  Name: title(body.name),
  Email: email(body.email),
  // Add properties that match your Notion database
};
```

### Change Styling

All styles are in `app/page.jsx` in the `styles` object. Modify colors, fonts, spacing to match your brand.

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nina-client-onboarding.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Select your GitHub repo
4. Vercel auto-detects Next.js

### 3. Add Environment Variables

In Vercel project settings → "Environment Variables":

```
NOTION_TOKEN = secret_abc123xyz...
NOTION_DB_ID = 323c1adacbe780648916df44ef5a8465
```

### 4. Deploy

Click "Deploy". Your form is now live at `your-project.vercel.app`.

## Troubleshooting

**Form submits but nothing in Notion:**
- Check that your Notion Integration has access to the database
- Verify `NOTION_TOKEN` and `NOTION_DB_ID` are correct in environment variables
- Check browser console for network errors

**"Property does not exist" error:**
- The property names in the API route must match your Notion database exactly (case-sensitive)
- Example: If Notion has "Company Name", use `"Company Name"` (with space)

**Form isn't submitting:**
- Make sure all required fields are filled
- Check browser console for error messages
- Verify API endpoint is `/api/submit`

## Files

- `app/page.jsx` — Your form UI (customize this)
- `app/api/submit/route.js` — API endpoint (update property mapping)
- `lib/notion.js` — Notion client (don't change)
- `app/globals.css` — Global styles
- `.env.local` — Your secrets (never commit)

## Next Steps

Once this is working:
- Add more form fields and Notion properties
- Change styling to match different use cases
- Add validation before submitting
- Create a dashboard to view submissions
- Set up email notifications on new submissions
