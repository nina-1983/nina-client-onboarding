import { NextResponse } from "next/server";
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

    const page = await notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
    });

    return NextResponse.json(
      { ok: true, id: page.id, url: page.url },
      { headers: corsHeaders(origin) }
    );
  } catch (error) {
    console.error("Notion error:", error);
    return NextResponse.json(
      { error: error.message || "Could not save submission" },
      { status: 500, headers: corsHeaders(origin) }
    );
  }
}
