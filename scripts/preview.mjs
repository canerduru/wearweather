import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const port = Number(process.env.PORT ?? 8081);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css",
  ".json": "application/json",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};
createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = resolve(root, "." + path);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    try {
      if (!(await stat(file)).isFile()) file = resolve(root, "index.html");
    } catch {
      if (extname(file)) {
        res.writeHead(404);
        res.end();
        return;
      }
      file = resolve(root, "index.html");
    }
    res.setHeader(
      "Content-Type",
      types[extname(file)] ?? "application/octet-stream",
    );
    res.setHeader("Cache-Control", "no-store");
    res.end(await readFile(file));
  } catch {
    res.writeHead(500);
    res.end("Preview unavailable");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`WearWeather preview: http://localhost:${port}`);
  if (process.argv.includes("--open") && process.platform === "darwin") {
    spawn("open", [`http://localhost:${port}`], { stdio: "ignore" }).on("error", () => {
      console.log("Open the preview URL above in your browser.");
    });
  }
});
