import type { Route } from "./+types/index";

import { createDb } from "~/db";
import { urls } from "~/db/schema";

import { Form, useLoaderData, useNavigation } from "react-router";
import { nanoid } from "nanoid";

import UrlItem from "~/ui/UrlItem";
import EmptyState from "~/ui/EmptyState";
import LinkIcon from "~/ui/icon/LinkIcon";
import ShareIcon from "~/ui/icon/ShareIcon";

// Metadata for Index Route
export function meta({}: Route.MetaArgs) {
  return [{ title: "URL Shortener" }];
}

// Route Data Loader (loads urls)
export async function loader({ context }: Route.LoaderArgs) {
  const db = createDb(context.cloudflare.env.DB);
  const allUrls = await db.select().from(urls).all();
  return { urls: allUrls };
}

// Route Action
export async function action({ request, context }: Route.ActionArgs) {
  const db = createDb(context.cloudflare.env.DB);
  const formData = await request.formData();
  const originalUrl = formData.get("url") as string;

  if (!originalUrl) return { error: "URL is required" };

  const shortCode = nanoid(6);
  await db.insert(urls).values({ shortCode, originalUrl });

  return { success: true };
}
export default function Home() {
  const { urls } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  if (urls.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-6 py-16 flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="mb-12 shrink-0">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">URL Shortener</h1>
          <p className="mt-2 text-sm text-zinc-500">Paste a long URL, get a short one. Simple.</p>
        </div>

        {/* Form */}
        <Form key={urls.length} method="post" className="mb-10 shrink-0">
          <div className="flex gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl focus-within:border-zinc-600 transition-colors duration-200">
            <div className="flex items-center pl-3 text-zinc-600">
              <LinkIcon />
            </div>
            <input
              name="url"
              type="url"
              placeholder="https://example.com/very/long/url/that/nobody-wants-to-type"
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

        {/* List header */}
        {urls.length > 0 && (
          <>
            <div className="flex flex-col min-h-0 flex-1">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    {urls.length} {urls.length === 1 ? "link" : "links"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-xs font-mono text-zinc-500">
                    {totalClicks.toLocaleString()} total clicks
                  </span>
                </div>
                <div className="h-px flex-1 mx-4 bg-zinc-800" />
              </div>

              <ul className="space-y-2 overflow-y-auto pr-1">
                {urls.map((url) => (
                  <UrlItem
                    key={url.id}
                    clicks={url.clicks}
                    shortCode={url.shortCode}
                    originalUrl={url.originalUrl}
                  />
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
