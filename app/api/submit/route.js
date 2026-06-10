import { NextResponse } from "next/server";
import { notion, DB_ID, title, rich, dateProp } from "@/lib/notion";

export async function POST(request) {
  try {
    if (!process.env.NOTION_TOKEN || !DB_ID) {
      return NextResponse.json(
        { error: "Missing Notion configuration" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const properties = {
      Name: title(body.name || "Untitled"),
      Email: rich(body.email || ""),
      Phone: rich(body.phone || ""),
      Company: rich(body.company || ""),
      "Project Details": rich(body.notes || ""),
      "Submitted At": dateProp(body.submittedAt),
    };

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
