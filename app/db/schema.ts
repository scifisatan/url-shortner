import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable("urls", {
  id: int().primaryKey({ autoIncrement: true }),
  shortCode: text("short_code").notNull().unique(),
  originalUrl: text("original_url").notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  clicks: int().notNull().default(0),
});
