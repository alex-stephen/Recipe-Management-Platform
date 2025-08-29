import { NextResponse } from "next/server";
import { Yazio } from "yazio";

export async function GET() {
  try {
    const yazio = new Yazio({
      credentials: {
        username: process.env.YAZIO_USERNAME!,
        password: process.env.YAZIO_PASSWORD!,
      },
    });

    const items = await yazio.user.getConsumedItems({ date: new Date() });
    return NextResponse.json(items);
  } catch (err: any) {
    console.error("Yazio fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch Yazio items", details: err.message }, { status: 500 });
  }
}