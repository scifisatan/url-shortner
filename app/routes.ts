import type { RouteConfig } from "@react-router/dev/routes";

const routes: RouteConfig = [
  { path: "/", file: "routes/index.tsx", index: true },
  { path: ":code", file: "routes/redirect.tsx" },
];

export default routes;
