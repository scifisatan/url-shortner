import { urls } from "~/db/schema";
import LinkIcon from "./icon/LinkIcon";
import EyeIcon from "./icon/EyeIcon";
import ShareIcon from "./icon/ShareIcon";

type Url = typeof urls.$inferSelect;

function UrlItem(url: Omit<Url, "id" | "createdAt">) {
  return (
    <li className="group relative flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/80 sm:flex-row sm:items-center sm:gap-5">
      <span className="absolute left-0 top-0 hidden h-full w-[3px] rounded-l-xl bg-gradient-to-b from-emerald-400 to-teal-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block" />
      <div className="flex items-center justify-between sm:contents">
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 group-hover:border-emerald-800 group-hover:bg-emerald-950 transition-all duration-200">
          <LinkIcon />
        </div>
        <div className="flex items-center gap-1.5 shrink-0 rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 transition-colors group-hover:border-zinc-600 sm:order-last">
          <EyeIcon />
          <span className="text-xs font-mono font-bold text-zinc-300">
            {url.clicks.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <a
          href={`/${url.shortCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-base sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span className="text-zinc-600">/</span>
          {url.shortCode}
          <ShareIcon />
        </a>
        <p className="text-xs text-zinc-500 break-all font-mono leading-relaxed line-clamp-2 sm:line-clamp-1">
          {url.originalUrl}
        </p>
      </div>
    </li>
  );
}

export default UrlItem;
