# yt-dlp-web

This project contains a simple web UI and the required services to download YouTube video and audio using [yt-dlp](https://github.com/yt-dlp/yt-dlp)

Docker is supported.

> Note: code for the docker container was taken from [https://github.com/tnk4on/yt-dlp](https://github.com/tnk4on/yt-dlp)

## How to build

```bash
docker build -t gappc/yt-dlp-web .
```

## How to run

```bash
docker run --rm -p 13000:8000 gappc/yt-dlp-web
```

Open your browser and go to [http://localhost:13000](http://localhost:13000)
