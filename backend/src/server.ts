console.log("Hello World");

import Router from "koa-router";
import koa from "koa";

import { exec } from "child_process";
import { promisify } from "util";

import mime from "mime-types";
import * as fs from "fs";
import { isUrlValid } from "./validator";

const execAsync = promisify(exec);

const app = new koa();
const router = new Router();

router.get("/hello", (ctx) => (ctx.body = "Hello World!"));

router.get("/videos", async (ctx) => {
  console.log("-------------------------------------");
  console.log("------------ GET /videos ------------");

  const mediaUrl = ctx.request.query.url;

  console.log("mediaUrl", mediaUrl);

  if (!isUrlValid(mediaUrl)) {
    console.log("Invalid download URL", mediaUrl);
    ctx.status = 400;
    ctx.body = "Invalid download URL";
    return;
  }

  const command = `yt-dlp --no-simulate --dump-json -o "media/%(title)s.%(ext)s" ${mediaUrl}`;

  console.log("command", command);

  const { stderr, stdout } = await execAsync(command);

  console.log("Download success");

  const data = JSON.parse(stdout);

  console.log("JSON parsed");

  const { filename } = data;
  const path = `./${filename}`;

  const mimeType = mime.lookup(path);
  if (mimeType) {
    ctx.response.set("content-type", mimeType);
  }
  ctx.response.set(
    "content-disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
  );

  const src = fs.createReadStream(path);
  ctx.body = src;
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend started at http://localhost:${PORT}`)
);
