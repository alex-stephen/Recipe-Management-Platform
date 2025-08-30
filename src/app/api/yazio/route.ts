import { NextResponse } from "next/server";
import { Yazio } from "yazio";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const meal = searchParams.get("meal"); // breakfast, lunch, dinner, snack

    const yazio = new Yazio({
      credentials: {
        username: process.env.YAZIO_USERNAME!,
        password: process.env.YAZIO_PASSWORD!,
      },
    });

    const items = await yazio.user.getConsumedItems({ date: new Date() });

    const productsWithNutrients = await Promise.all(
      items.products.map(async (item) => {
        const product = await yazio.products.get(item.product_id);

        // scale nutrients by consumed amount
        const scaledNutrients: Record<string, number> = {};
        if (product?.nutrients) {
          for (const [key, value] of Object.entries(product.nutrients)) {
            scaledNutrients[key] = (value as number) * item.amount;
          }
        }

        return {
          ...item,
          name: product?.name,
          brand: product?.producer ?? "",
          nutrients: scaledNutrients,
        };
      })
    );

    const filtered = meal
      ? productsWithNutrients.filter((item) => item.daytime === meal)
      : productsWithNutrients;

    return NextResponse.json({ products: filtered });
  } catch (err: any) {
    console.error("Yazio fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch Yazio items", details: err.message },
      { status: 500 }
    );
  }
}