# 目录职责

`data/papers/` 预留给手工维护的论文输入文件或样本文档。

# 允许内容

- 手工放入的 PDF 样本
- 论文网址输入 CSV / TXT
- 辅助说明文本

# 禁止内容

- 生成缓存
- 应用源码
- 最终视频产物

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- PDF：`<paper-id>.pdf`
- 网址 CSV：`paper-urls.csv` 或 `paper-urls.example.csv`
- 网址 TXT：`paper-urls.txt`
- 说明：`<paper-id>.md` 或 `README.md`

推荐的论文网址 CSV 结构：

```csv
paper_url, status
https://arxiv.org/abs/2604.22748, unprocessed
https://arxiv.org/abs/2604.22736, processed
https://arxiv.org/abs/1706.03762, published
https://arxiv.org/abs/9999.99999, error
```

状态说明：

- `unprocessed`
  - 还未处理，会被批量命令继续生成
- `processed`
  - 已经成功生成过，后续默认跳过
- `published`
  - 已经生成并发布过，后续默认跳过
  - 仍然参与论文去重检查，不会被 `update:paper-urls` 重复加入
- `error`
  - 上次处理时出错，后续默认跳过；需要重试时手工改回 `unprocessed`

抓最新论文时，`npm run update:paper-urls -- --limit N` 的含义是：

- 目标是往当前 CSV 里补 `N` 篇“之前没出现过”的新论文
- 如果最新一页抓到的论文都已经在 CSV 里，命令会继续向更早的页面查找
- 直到补满 `N` 篇新论文，或者当前可扫描窗口已经没有更多新论文

# 边界说明

这里是手工输入区，不是缓存区。
自动抓取缓存仍应留在 `output/cache/papers/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把缓存文件直接复制成长期手工资产，除非明确整理命名。
