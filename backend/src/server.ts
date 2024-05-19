console.log("Hello World");

import koa from "koa";
import Router from "koa-router";

import { exec } from "child_process";
import { promisify } from "util";

import * as fs from "fs";
import { buildFileInfo, isUrlValid } from "./utils";

import cron from "node-cron";

const execAsync = promisify(exec);

const app = new koa();
const router = new Router();

const mediaFolder = "media";

router.get("/hello", (ctx) => (ctx.body = "Hello World!"));

router.get("/videos", async (ctx) => {
  console.log("-------------------------------------");
  console.log("------------ GET /videos ------------");

  const mediaUrl = ctx.request.query.mediaUrl;
  console.log("mediaUrl", mediaUrl);

  const audioOnly = ctx.request.query.audioOnly != null ?? false;
  console.log("audioOnly", audioOnly);

  if (!isUrlValid(mediaUrl)) {
    console.log("Invalid download URL", mediaUrl);
    ctx.status = 400;
    ctx.body = "Invalid download URL";
    return;
  }

  const baseCommand = `yt-dlp --no-simulate --dump-json -o "${mediaFolder}/%(title)s.%(ext)s"`;
  const withAudioOnly = audioOnly ? "-f 'ba' -x --audio-format mp3" : "";

  const command = `${baseCommand} ${withAudioOnly} ${mediaUrl}`;

  console.log("command", command);

  const { stderr, stdout } = await execAsync(command);

  console.log("Download success");

  const data = JSON.parse(stdout);

  const fileInfo = buildFileInfo(data.filename, audioOnly);

  console.log("fileInfo", fileInfo);

  const encodedFilename = encodeURIComponent(fileInfo.filename);

  ctx.response.set(
    "content-disposition",
    `attachment; filename*=UTF-8''${encodedFilename}`
  );

  ctx.response.set("filename", encodedFilename);

  const src = fs.createReadStream(fileInfo.location);
  ctx.body = src;
});

app.use(router.routes()).use(router.allowedMethods());

// cron job to remove files in media folder
const cronInterval = "* * * * * *";
cron.schedule(cronInterval, () => {
  console.log(`running file remove task for cron interval ${cronInterval}`);

  fs.readdirSync(mediaFolder).forEach((file) => {
    const filePath = `${mediaFolder}/${file}`;

    // delete file if older than X miliseconds
    const older = 5 * 60 * 1000;
    const isOlder = fs.statSync(filePath).ctime.getTime() < Date.now() - older; // 604800000 = 7 * 24 * 60 * 60 * 1000

    if (isOlder) {
      console.log(`- deleting file ${file} after ${older}ms`);
      fs.unlinkSync(filePath);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend started at http://localhost:${PORT}`)
);
