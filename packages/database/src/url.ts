import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = join(dirname(fileURLToPath(import.meta.url)), "..");

export function resolveDatabaseUrl(url: string): string {
  if (!url.startsWith("file:")) return url;

  const path = url.slice("file:".length);
  if (isAbsolute(path)) return url;

  return `file:${join(packageDir, path)}`;
}
