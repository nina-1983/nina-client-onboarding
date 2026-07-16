import { Client } from "@notionhq/client";

export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const DB_ID = process.env.NOTION_DB_ID || "323c1adacbe780648916df44ef5a8465";

export function title(text = "") {
    const str = String(text || "").trim() || "Untitled";
    return {
          title: [
            {
                      type: "text",
                      text: { content: str.slice(0, 1900) },
            },
                ],
    };
}

export function rich(text = "") {
    const str = String(text || "").trim();
    if (!str) return { rich_text: [] };
    return {
          rich_text: [
            {
                      type: "text",
                      text: { content: str.slice(0, 1900) },
            },
                ],
    };
}

export function email(value) {
    const str = String(value || "").trim();
    return { email: str || null };
}

export function phone(value) {
    const str = String(value || "").trim();
    return { phone_number: str || null };
}

export function dateProp(value) {
    if (!value) return { date: null };
    return { date: { start: String(value).trim() } };
}
