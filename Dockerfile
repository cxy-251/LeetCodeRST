FROM node:24-bookworm

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive \
    NODE_ENV=development \
    PAPER_TO_VIDEO_PYTHON_MODE=direct \
    PAPER_TO_VIDEO_PYTHON_BIN=python3 \
    PAPER_TO_VIDEO_FFPROBE_BIN=ffprobe \
    LM_STUDIO_BASE_URL=http://host.docker.internal:1234/v1 \
    LM_STUDIO_API_KEY=lm-studio \
    REMOTION_GL=angle \
    REMOTION_CONCURRENCY=2

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    ca-certificates \
    curl \
    git \
    chromium \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    libglib2.0-0 \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    libgtk-3-0 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json tsconfig.base.json AGENTS.md PROJECT_MAP.md README.md ./
COPY apps ./apps
COPY packages ./packages
COPY services ./services
COPY tools ./tools
COPY data ./data
COPY docs ./docs
COPY public ./public

RUN npm install
RUN pip3 install --no-cache-dir edge-tts pypdf
RUN npx remotion browser ensure

EXPOSE 3100

CMD ["npm", "run", "dev:editor", "--", "--host", "0.0.0.0", "--port", "3100"]
