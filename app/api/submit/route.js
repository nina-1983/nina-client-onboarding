import { NextResponse } from "next/server";
import { notion, DB_ID, title, rich, email, dateProp } from "@/lib/notion";

function phone(value) {
  return { phone_number: value || null };
}

export async function POST(request) {
  try {
    console.log("TOKEN:", process.env.NOTION_TOKEN?.slice(0, 15), "length:", process.env.NOTION_TOKEN?.length);

    if (!process.env.NOTION_TOKEN || !DB_ID) {
      return NextResponse.json(
        { error: "Missing Notion configuration" },
        { status: 500 }
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

    return NextResponse.json({
      ok: true,
      id: page.id,
      url: page.url,
    });
  } catch (error) {
    console.error("Notion error:", error);
    return NextResponse.json(
      { error: error.message || "Could not save submission" },
      { status: 500 }
    );
  }
}
