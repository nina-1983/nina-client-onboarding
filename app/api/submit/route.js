import { NextResponse } from "next/server";
import { google } from "googleapis";
import { notion, DB_ID, title, rich, email, dateProp } from "@/lib/notion";

const ALLOWED_ORIGINS = [
  "https://nina-mistry.com",
  "https://www.nina-mistry.com",
  "https://nina-client-onboarding.vercel.app",
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[2];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

function phone(value) {
  return { phone_number: value || null };
}

async function createContract(data) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });

  const templateId = process.env.GOOGLE_DOC_TEMPLATE_ID;
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const copy = await drive.files.copy({
    fileId: templateId,
    requestBody: {
      name: `Contract — ${data.name} (${today})`,
      parents: ["1SHIFEI61p2njCNpgk4YytKYuFJ0PwFal"],
    },
  });

  const docId = copy.data.id;

  const replacements = [
    ["{{client_name}}",    data.name      || ""],
    ["{{client_email}}",   data.email     || ""],
    ["{{client_phone}}",   data.phone     || ""],
    ["{{client_company}}", data.company   || ""],
    ["{{client_address}}", data.address   || ""],
    ["{{client_postcode}}",data.postcode  || ""],
    ["{{date}}",           today],
  ];

  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: replacements.map(([find, replace]) => ({
        replaceAllText: {
          containsText: { text: find, matchCase: true },
          replaceText: replace,
        },
      })),
    },
  });

  return `https://docs.google.com/document/d/${docId}/edit`;
}

export async function POST(request) {
  const origin = request.headers.get("origin") || "";

  try {
    if (!process.env.NOTION_TOKEN || !DB_ID) {
      return NextResponse.json(
        { error: "Missing Notion configuration" },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    const body = await request.json();

    const properties = {
      Clients: title(body.name || "Untitled"),
      Email: email(body.email || ""),
      Phone: phone(body.phone || ""),
      Company: rich(body.company || ""),
      Address: rich(body.address || ""),
      Postcode: rich(body.postcode || ""),
      Notes: rich(body.notes || ""),
    };

    if (body.submittedAt) {
      properties["Date Submitted"] = dateProp(body.submittedAt);
    }

    const [page, contractUrl] = await Promise.all([
      notion.pages.create({ parent: { database_id: DB_ID }, properties }),
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_DOC_TEMPLATE_ID
        ? createContract(body)
        : Promise.resolve(null),
    ]);

    return NextResponse.json(
      { ok: true, id: page.id, contractUrl },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: error.message || "Could not save submission" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
