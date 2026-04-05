import type { Route } from "./+types/index";

import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import {
  createShortCode,
  normalizeHttpUrl,
  shortCodeToKey,
} from "~/lib/url-shortener";
import LinkIcon from "~/ui/icon/LinkIcon";
import ShareIcon from "~/ui/icon/ShareIcon";

type ActionData = {
  error?: string;
  shortUrl?: string;
  enteredUrl?: string;
};

const MAX_RESERVATION_ATTEMPTS = 10;

async function reserveShortCode(kv: KVNamespace, originalUrl: string) {
  // KV has no conditional writes, so this is a best-effort retry loop.
  for (let attempt = 0; attempt < MAX_RESERVATION_ATTEMPTS; attempt += 1) {
    const shortCode = createShortCode();
    const key = shortCodeToKey(shortCode);
    const existingUrl = await kv.get(key, "text");

    if (existingUrl) {
      console.warn("Short code collision detected during KV reservation.", {
        shortCode,
        attempt: attempt + 1,
      });
      continue;
    }

    await kv.put(key, originalUrl);
    return shortCode;
  }

  return null;
}

// Metadata for Index Route
export function meta(_: Route.MetaArgs) {
  return [{ title: "URL Shortener" }];
}

// Route Action
export async function action({
  request,
  context,
}: Route.ActionArgs): Promise<ActionData> {
  const env = context.cloudflare.env;
  const formData = await request.formData();
  const rawUrl = formData.get("url");
  const enteredUrl = typeof rawUrl === "string" ? rawUrl.trim() : "";

  if (!enteredUrl) {
    return { error: "URL is required.", enteredUrl };
  }

  const clientIp = request.headers.get("CF-Connecting-IP") ?? "anonymous";
  const { success } = await env.CREATE_RATE_LIMITER.limit({
    key: `create:${clientIp}`,
  });

  if (!success) {
    return {
      error: "Too many requests. Please wait a minute and try again.",
      enteredUrl,
    };
  }

  const originalUrl = normalizeHttpUrl(enteredUrl);

  if (!originalUrl) {
    return { error: "Please enter a valid http(s) URL.", enteredUrl };
  }

  const shortCode = await reserveShortCode(env.URLS, originalUrl);

  if (!shortCode) {
    return {
      error: "Could not generate a unique short URL. Try again.",
      enteredUrl,
    };
  }

  const shortUrl = new URL(`/${shortCode}`, request.url).toString();

  return { shortUrl };
}

export default function Home() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const isSubmitting = navigation.state === "submitting";
  const createdUrl = actionData?.shortUrl;
  const error = actionData?.error;

  useEffect(() => {
    setCopyState("idle");
  }, [createdUrl]);

  async function handleCopy() {
    if (!createdUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(createdUrl);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-6 py-16 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="mb-12 shrink-0">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
            URL Shortener
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Paste a long URL and get a short one. Save it now, we do not list
            links later.
          </p>
        </div>

        {/* Form */}
        <Form
          key={createdUrl ?? "new-link"}
          method="post"
          className="mb-10 shrink-0"
        >
          <div className="flex gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl focus-within:border-zinc-600 transition-colors duration-200">
            <div className="flex items-center pl-3 text-zinc-600">
              <LinkIcon />
            </div>
            <input
              name="url"
              type="url"
              placeholder="https://example.com/very/long/url/that/nobody-wants-to-type"
              defaultValue={actionData?.enteredUrl ?? ""}
              required
              disabled={isSubmitting}
              className="flex-1 bg-transparent font-mono text-sm text-zinc-200 placeholder:text-zinc-600 outline-none py-2.5 pr-2 disabled:opacity-40 min-w-0"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  <span className="hidden md:block">Shortening</span>
                </>
              ) : (
                <>
                  <ShareIcon />
                  <span className="hidden md:block">Shorten</span>
                </>
              )}
            </button>
          </div>
        </Form>

        {error && (
          <div className="rounded-xl border border-red-900/80 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {createdUrl && (
          <div className="rounded-xl border border-emerald-900/70 bg-emerald-950/30 p-4 text-sm">
            <p className="text-emerald-300 font-medium">Short URL created</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <a
                href={createdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-mono text-emerald-200 hover:text-emerald-100"
              >
                {createdUrl}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md border border-emerald-700/80 bg-emerald-900/40 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-800/50"
              >
                {copyState === "copied" ? "Copied" : "Copy"}
              </button>
            </div>
            {copyState === "failed" && (
              <p className="mt-2 text-xs text-amber-200/90">
                Clipboard access failed. Copy the URL manually.
              </p>
            )}
            <p className="mt-3 text-xs text-emerald-100/70">
              Save this link now. For privacy, created links are not listed
              publicly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
