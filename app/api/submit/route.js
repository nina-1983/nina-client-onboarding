import { NextResponse } from "next/server";
import { notion, DB_ID, title, rich, dateProp } from "@/lib/notion";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    if (!process.env.NOTION_TOKEN || !DB_ID) {
      return NextResponse.json(
        { error: "Missing Notion configuration" },
        { status: 500 }
      );
    }

    const body = await request.json();

    // Save to Notion
    const properties = {
      Clients: title(body.name || "Untitled"),
      Email: rich(body.email || ""),
      Phone: rich(body.phone || ""),
      Company: rich(body.company || ""),
      Address: rich(body.address || ""),
      Postcode: rich(body.postcode || ""),
      Notes: rich(body.notes || ""),
      "Date Submitted": dateProp(body.submittedAt),
    };

    const page = await notion.pages.create({
      parent: { database_id: DB_ID },
      properties,
    });

    // Send email
    await resend.emails.send({
      from: "onboarding@nina-mistry.com",
      to: "nina@nina-mistry.com",
      subject: `New onboarding submission from ${body.name}`,
      html: `
        <h2>New Client Submission</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Company:</strong> ${body.company}</p>
        <p><strong>Project:</strong> ${body.notes}</p>
      `,
    });

    return NextResponse.json({
      ok: true,
      id: page.id,
      url: page.url,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Could not save submission" },
      { status: 500 }
    );
  }
}
