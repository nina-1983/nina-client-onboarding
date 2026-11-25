import { NextResponse } from "next/server";
import { notion, title, rich, email, dateProp } from "@/lib/notion";

// 🎄 Funnel Audit Submissions (Mission Control › ⚙️ Databases)
const AUDIT_DB_ID =
  process.env.NOTION_AUDIT_DB_ID || "423c1adacbe78144a3bdd312c923151b";

const ALLOWED_ORIGINS = [
  "https://nina-mistry.com",
  "https://www.nina-mistry.com",
  "https://nina-client-onboarding.vercel.app",
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[2];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Select values must be plain text without commas (Notion rule).
function select(value) {
  const str = String(value || "").replace(/,/g, "").trim();
  return { select: str ? { name: str.slice(0, 100) } : null };
}

function multi(values) {
  const list = Array.isArray(values) ? values : values ? [values] : [];
  return {
    multi_select: list
      .map((v) => String(v).replace(/,/g, "").trim())
      .filter(Boolean)
      .map((name) => ({ name: name.slice(0, 100) })),
  };
}

// Advent calendar: how many of the 12 free spots are taken.
// Counts every row in the database except ones marked "Not Now",
// so delete test rows (or mark them Not Now) to free a door back up.
const TOTAL_SPOTS = Number(process.env.AUDIT_TOTAL_SPOTS || 12);
const AUDIT_DATA_SOURCE_ID =
  process.env.NOTION_AUDIT_DATA_SOURCE_ID || "423c1ada-cbe7-81c2-8a68-000ba22c6c31";

async function countTaken() {
  let taken = 0;
  let cursor;
  do {
    const res = await fetch(
      `https://api.notion.com/v1/data_sources/${AUDIT_DATA_SOURCE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Notion-Version": "2025-09-03",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
          start_cursor: cursor,
          filter: {
            or: [
              { property: "Audit Status", select: { is_empty: true } },
              { property: "Audit Status", select: { does_not_equal: "Not Now" } },
            ],
          },
        }),
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error(`Notion count failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    taken += data.results.length;
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return taken;
}

export async function GET(request) {
  const origin = request.headers.get("origin") || "";
  const headers = { ...corsHeaders(origin), "Cache-Control": "no-store" };
  try {
    const taken = Math.min(await countTaken(), TOTAL_SPOTS);
    return NextResponse.json(
      { total: TOTAL_SPOTS, taken, left: TOTAL_SPOTS - taken },
      { headers }
    );
  } catch (error) {
    console.error("Notion count error (funnel audit):", error);
    return NextResponse.json({ error: "Could not count spots" }, { status: 500, headers });
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request) {
  const origin = request.headers.get("origin") || "";
  const headers = corsHeaders(origin);

  try {
    if (!process.env.NOTION_TOKEN || !AUDIT_DB_ID) {
      return NextResponse.json({ error: "Missing Notion configuration" }, { status: 500, headers });
    }

    const b = await request.json();

    // Honeypot: real people never fill this hidden field.
    if (b.website_url) {
      return NextResponse.json({ ok: true }, { headers });
    }

    if (!b.name || !b.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400, headers });
    }

    const page = await notion.pages.create({
      parent: { database_id: AUDIT_DB_ID },
      properties: {
        Name: title(b.name),
        "Audit Status": select("New"),
        Email: email(b.email),
        Handle: rich(b.handle),
        Business: rich(b.business),
        "Main Offer": rich(b.mainOffer),
        Links: rich(b.links),
        "No Funnel Yet": { checkbox: Boolean(b.noFunnelYet) },
        "Where They Find Me": multi(b.whereFound),
        "First Step": select(b.firstStep),
        "After Freebie": select(b.afterFreebie),
        "Last Walked Funnel": select(b.lastWalked),
        "Email Frequency": select(b.emailFrequency),
        "Follow Up": select(b.followUp),
        "New Subscribers 30d": select(b.newSubscribers),
        "Drop Off": rich(b.dropOff),
        "Fix One Thing": rich(b.fixOneThing),
        "Open To Offer": select(b.openToOffer),
        "Send Audit Via": select(b.sendVia),
        "Anything Else": rich(b.anythingElse),
        "Date Submitted": dateProp(b.submittedAt || new Date().toISOString()),
      },
    });

    return NextResponse.json({ ok: true, id: page.id }, { headers });
  } catch (error) {
    console.error("Notion error (funnel audit):", error);
    return NextResponse.json(
      { error: error.message || "Could not save submission" },
      { status: 500, headers }
    );
  }
}
