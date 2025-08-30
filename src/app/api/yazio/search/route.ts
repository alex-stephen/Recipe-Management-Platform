import { NextResponse } from "next/server";
import { Yazio } from "yazio";
import { findProduct } from "../helpers/findProduct";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    if (!q) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const yazio = new Yazio({
      credentials: {
        username: process.env.YAZIO_USERNAME!,
        password: process.env.YAZIO_PASSWORD!,
      },
    });

    // Use the API wrapper properly
    const results = await findProduct(yazio, q);

    // // Optionally, pick the best verified product
    // const best = results.find(p => p.is_verified) ?? results[0];

    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to search Yazio", details: err.message }, { status: 500 });
  }
}
