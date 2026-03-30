import { redirect } from "react-router";
import { eq } from "drizzle-orm";
import { createDb } from "~/db";
import { urls } from "~/db/schema";
import type { Route } from "./+types/redirect";

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = createDb(context.cloudflare.env.DB);

  const result = await db.select().from(urls).where(eq(urls.shortCode, params.code)).get();

  if (!result) throw new Response("Not found", { status: 404 });

  // increment url clicks
  await db
    .update(urls)
    .set({ clicks: result.clicks + 1 })
    .where(eq(urls.shortCode, params.code));

  return redirect(result.originalUrl);
}

export default function Redirect() {
  return null;
}
