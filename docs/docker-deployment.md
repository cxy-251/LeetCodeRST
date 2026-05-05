# Docker 部署手册

本手册面向“把源码打包给别人后，如何通过 Docker 快速运行”。

## 1. 这套 Docker 解决什么问题

当前镜像会预装：

- Node.js / npm
- Python 3
- `edge-tts`
- `pypdf`
- `ffmpeg` / `ffprobe`
- Chromium
- Remotion 浏览器依赖

目标是让买家不需要自己再配置：

- conda
- Python 包
- Remotion 浏览器
- 系统视频依赖

## 2. 关键文件

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

## 3. 构建镜像

首次建议先执行：

```bash
npm run init:deployment
```

这会创建生成目录，并在没有 `.env` 时自动复制 `.env.example`。

然后再构建：

```bash
docker compose build
```

## 4. 启动预览站

```bash
docker compose up
```

启动后访问：

- `http://localhost:3100`

## 5. 在容器里运行视频生产命令

### 单论文网址直接出视频

```bash
docker compose run --rm paper-to-video \
  npm run produce:paper-urls -- \
  --paper-url https://arxiv.org/abs/2604.22748 \
  --background-dir data/images/prepared \
  --cover-selection-mode local-folder-random \
  --summary-mode lm-studio
```

### 批量网址文件出视频

```bash
docker compose run --rm paper-to-video \
  npm run produce:paper-urls -- \
  --paper-url-file data/papers/paper-urls.txt \
  --background-dir data/images/prepared \
  --cover-selection-mode local-folder-random \
  --summary-mode lm-studio
```

### 使用 batch CSV 批量渲染

```bash
docker compose run --rm paper-to-video \
  npm run produce:video -- \
  --batch-config data/video-batches/demo-batch.csv
```

## 6. LM Studio 如何接入 Docker

当前 Docker 默认假设：

- LM Studio 跑在宿主机
- 地址是：`http://host.docker.internal:1234/v1`
- 模型名是：`qwen/qwen3.5-9b`

如果你的宿主机配置不同，可以通过环境变量覆盖：

```bash
LM_STUDIO_BASE_URL=http://host.docker.internal:1234/v1 \
LM_STUDIO_MODEL=qwen/qwen3.5-9b \
LM_STUDIO_MAX_OUTPUT_TOKENS=2200 \
LM_STUDIO_MAX_INPUT_CHARS=9000 \
LM_STUDIO_COMPACT_INPUT_CHARS=2600 \
docker compose run --rm paper-to-video \
  npm run produce:paper-urls -- \
  --paper-url https://arxiv.org/abs/2604.22748 \
  --background-dir data/images/prepared \
  --summary-mode lm-studio
```

## 7. 卷挂载说明

当前 `docker-compose.yml` 默认挂载：

- `./data -> /app/data`
- `./output -> /app/output`
- `./public -> /app/public`

这意味着：

- 你在宿主机修改配置，容器里会立刻看到
- 生成的视频和中间产物会保存在宿主机的 `output/`

## 8. 适合售卖源码时怎么交付

推荐至少一起交付：

1. 源码仓库
2. `docs/video-production-manual.md`
3. `docs/docker-deployment.md`
4. 一个准备好的背景图目录示例
5. 一个 `paper-urls.txt` 示例
6. 一个 `demo-batch.csv` 示例
7. `docs/docker-first-run-checklist.md`

## 9. 当前限制

1. `LM Studio` 需要买家自己在宿主机启动
2. `edge-tts` 仍然依赖网络访问微软语音服务
3. `licensed-source` 和 `ai-generated-cover` 目前还是预留接口，尚未在 Docker 内实现 provider

## 10. 首次启动排查

买家第一次启动时，建议按这份清单逐项确认：

- `docs/docker-first-run-checklist.md`
