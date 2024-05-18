console.log("Hello World");

import koa from "koa";
import Router from "koa-router";

import { exec } from "child_process";
import { promisify } from "util";

import * as fs from "fs";
import { buildFileInfo, isUrlValid } from "./utils";

const execAsync = promisify(exec);

const app = new koa();
const router = new Router();

router.get("/hello", (ctx) => (ctx.body = "Hello World!"));

router.get("/videos", async (ctx) => {
  console.log("-------------------------------------");
  console.log("------------ GET /videos ------------");

  const mediaUrl = ctx.request.query.mediaUrl;
  console.log("mediaUrl", mediaUrl);

  const audioOnly = !!ctx.request.query.audioOnly ?? false;
  console.log("audioOnly", audioOnly);

  if (!isUrlValid(mediaUrl)) {
    console.log("Invalid download URL", mediaUrl);
    ctx.status = 400;
    ctx.body = "Invalid download URL";
    return;
  }

  const folder = "media";

  const baseCommand = `yt-dlp --no-simulate --dump-json -o "${folder}/%(title)s.%(ext)s"`;
  const withAudioOnly = audioOnly ? "-f 'ba' -x --audio-format mp3" : "";

  const command = `${baseCommand} ${withAudioOnly} ${mediaUrl}`;

  console.log("command", command);

  const { stderr, stdout } = await execAsync(command);

  console.log("Download success");

  const data = JSON.parse(stdout);

  const fileInfo = buildFileInfo(data.filename, audioOnly);

  console.log("fileInfo", fileInfo);

  ctx.response.set(
    "content-disposition",
    `attachment; filename*=UTF-8''${encodeURIComponent(fileInfo.filename)}`
  );

  const src = fs.createReadStream(fileInfo.location);
  ctx.body = src;
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend started at http://localhost:${PORT}`)
);
