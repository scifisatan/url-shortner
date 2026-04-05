import { redirect } from "react-router";
import type { Route } from "./+types/redirect";
import {
  isValidShortCode,
  normalizeHttpUrl,
  shortCodeToKey,
} from "~/lib/url-shortener";

export async function loader({ params, context }: Route.LoaderArgs) {
  const code = params.code;

  if (!code || !isValidShortCode(code)) {
    throw new Response("Not found", { status: 404 });
  }

  const originalUrl = await context.cloudflare.env.URLS.get(
    shortCodeToKey(code),
    "text",
  );

  if (!originalUrl) {
    throw new Response("Not found", { status: 404 });
  }

  const destinationUrl = normalizeHttpUrl(originalUrl);

  if (!destinationUrl) {
    throw new Response("Not found", { status: 404 });
  }

  return redirect(destinationUrl);
}

export default function Redirect() {
  return null;
}
