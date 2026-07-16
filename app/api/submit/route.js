import { NextResponse } from "next/server";
import { notion, DB_ID, title, rich, email, phone, dateProp } from "@/lib/notion";

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
              Clients: title(body.name),
              Email: email(body.email),
              Phone: phone(body.phone),
              Company: rich(body.company),
              Address: rich(body.address),
              Postcode: rich(body.postcode),
              Notes: rich(body.notes),
              "Date Submitted": dateProp(body.submittedAt),
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
