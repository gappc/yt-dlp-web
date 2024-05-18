# Taken from https://github.com/tnk4on/yt-dlp

FROM python:alpine

RUN apk add --update --no-cache --virtual .build-deps gcc musl-dev \
&& pip install --upgrade pip \
&& pip install pycrypto yt-dlp \
&& rm -rf ~/.cache/pip \
&& apk del .build-deps \
&& apk add ffmpeg \
&& chmod o+w /media \
&& adduser -D yt-dlp

COPY ./yt-dlp.conf /etc/yt-dlp.conf

WORKDIR /media

USER yt-dlp

ENTRYPOINT ["yt-dlp"]