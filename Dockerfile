# Taken from https://github.com/tnk4on/yt-dlp

FROM python:alpine

RUN apk add --update --no-cache --virtual .build-deps gcc musl-dev \
&& pip install --upgrade pip \
&& pip install pycrypto yt-dlp \
&& rm -rf ~/.cache/pip \
&& apk del .build-deps \
&& apk add ffmpeg \
&& apk add nodejs npm \
&& npm install -g local-web-server \
&& adduser -D yt-dlp

COPY ./yt-dlp.conf /etc/yt-dlp.conf

RUN mkdir -p /app/frontend \
&& mkdir -p /app/backend 

COPY ./frontend/dist /app/frontend
COPY ./backend /app/backend

RUN mkdir -p /app/backend/media \
&& chmod o+w /app/backend/media \
&& cd /app/backend && npm install

COPY ./docker-runner.sh /app/docker-runner.sh
RUN chmod +x /app/docker-runner.sh

WORKDIR /app/backend/media

USER yt-dlp

ENTRYPOINT ["sh", "/app/docker-runner.sh"]