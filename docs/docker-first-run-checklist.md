# Docker 首次启动检查清单

这份清单面向第一次拿到源码的人。

## 1. 先准备什么

确认本机有：

- Docker Desktop
- LM Studio 桌面版
- 至少一个已加载的本地模型

当前默认模型：

- `gemma-4-e4b`

当前默认 LM Studio 地址：

- `http://127.0.0.1:1234/v1`

## 2. 第一次初始化

先执行：

```bash
npm run init:deployment
```

这会：

- 创建必要的生成目录
- 如果没有 `.env`，就从 `.env.example` 复制一份

## 3. 检查 `.env`

重点确认：

- `LM_STUDIO_BASE_URL`
- `LM_STUDIO_MODEL`
- `LM_STUDIO_API_KEY`

如果你直接在宿主机跑脚本，通常可用：

```env
LM_STUDIO_BASE_URL=http://127.0.0.1:1234/v1
```

如果你通过 Docker 容器访问宿主机上的 LM Studio，通常可用：

```env
LM_STUDIO_BASE_URL=http://host.docker.internal:1234/v1
```

## 4. 先确认本地模型能响应

在 LM Studio 里确认：

- 本地服务器已开启
- 端口是 `1234`
- 模型已真正加载

## 5. 构建容器

```bash
docker compose build
```

## 6. 启动预览站

```bash
docker compose up
```

然后访问：

- `http://localhost:3100`

## 7. 先跑一条最小链路

```bash
docker compose run --rm paper-to-video \
  npm run produce:paper-urls -- \
  --paper-url https://arxiv.org/abs/2604.22748 \
  --background-dir data/images/prepared \
  --cover-selection-mode local-folder-random \
  --summary-mode lm-studio
```

## 8. 成功后去哪里看结果

主要看：

- `output/runs/`
- `output/latest-run.json`
- `output/video-runs.csv`

## 9. 如果失败，先看哪几类问题

1. LM Studio 没启动
2. 模型名和 `.env` 不一致
3. 背景图目录为空
4. Docker 容器无法访问宿主机 `1234`
5. `edge-tts` 联网失败
