import { Yazio } from "yazio";

export async function findProduct(
  yazio: Yazio,
  ingredientName: string
) {
  // search the Yazio database
  const results = await yazio.products.search({ query: ingredientName });

  if (!results || results.length === 0) {
    return null;
  }

  // prioritize exact name match + verified
  const exactVerified = results.find(
    (p) =>
      p.name.toLowerCase() === ingredientName.toLowerCase() && p.is_verified
  );
  if (exactVerified) return exactVerified;

  // fallback: any verified product containing the name
  const verifiedContains = results.find(
    (p) =>
      p.name.toLowerCase().includes(ingredientName.toLowerCase()) &&
      p.is_verified
  );
  if (verifiedContains) return verifiedContains;

  // fallback: any product containing the name
  const contains = results.find((p) =>
    p.name.toLowerCase().includes(ingredientName.toLowerCase())
  );
  if (contains) return contains;

  // if nothing matches, return the first result
  return results[0];
}
