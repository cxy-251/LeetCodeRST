# 目录职责

`services/image-provider/` 预留给图片来源适配层。

# 允许内容

- 图片 provider 适配服务
- Provider 说明文档

# 禁止内容

- 位图资源本身
- 页面 UI
- 批量视频调度逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- `*.service.ts`
- `*.types.ts`
- `README.md`

当前建议文件：

- `image-provider.service.ts`
- `image-provider.types.ts`

# 边界说明

这里只处理“怎么拿图”。
图片处理工具在 `tools/`，图片文件在 `data/images/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把图片位图直接塞进服务目录。
