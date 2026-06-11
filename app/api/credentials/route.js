import { NextResponse } from "next/server";
import { notion, title, rich, dateProp } from "@/lib/notion";

const CREDENTIALS_DB_ID = process.env.NOTION_DB_ID;

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

function fmt(fields) {
  return fields
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");
}

export async function POST(request) {
  const origin = request.headers.get("origin") || "";

  try {
    if (!process.env.NOTION_TOKEN || !CREDENTIALS_DB_ID) {
      return NextResponse.json(
        { error: "Missing Notion configuration" },
        { status: 500, headers: corsHeaders(origin) }
      );
    }

    const b = await request.json();

    const properties = {
      Client: title(b.clientName || "Untitled"),
      Website: rich(fmt([["Platform", b.websitePlatform], ["URL", b.websiteUrl], ["Username", b.websiteUser], ["Password", b.websitePass]])),
      Membership: rich(fmt([["Platform", b.memberPlatform], ["URL", b.memberUrl], ["Username", b.memberUser], ["Password", b.memberPass]])),
      Hosting: rich(fmt([["Provider", b.hostingProvider], ["URL", b.hostingUrl], ["Username", b.hostingUser], ["Password", b.hostingPass]])),
      Domain: rich(fmt([["Registrar", b.domainRegistrar], ["URL", b.domainUrl], ["Username", b.domainUser], ["Password", b.domainPass]])),
      "Email Marketing": rich(fmt([["Platform", b.emailPlatform], ["Username", b.emailUser], ["Password", b.emailPass]])),
      "Stripe Invite Sent": rich(b.stripeInvited || ""),
      Other: rich(b.other || ""),
    };

    if (b.submittedAt) {
      properties["Date Submitted"] = dateProp(b.submittedAt);
    }

    const page = await notion.pages.create({
      parent: { database_id: CREDENTIALS_DB_ID },
      properties,
    });

    return NextResponse.json(
      { ok: true, id: page.id },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Notion credentials error:", error);
    return NextResponse.json(
      { error: error.message || "Could not save credentials" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
