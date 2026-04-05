import { redirect } from "react-router";
import type { Route } from "./+types/redirect";

export async function loader({ params, context }: Route.LoaderArgs) {
  const code = params.code;

  if (!code) {
    throw new Response("Not found", { status: 404 });
  }

  const originalUrl = await context.cloudflare.env.URLS.get(
    `u:${code}`,
    "text",
  );

  if (!originalUrl) {
    throw new Response("Not found", { status: 404 });
  }

  return redirect(originalUrl);
}

export default function Redirect() {
  return null;
}
