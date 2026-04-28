# 目录职责

这是 `PaperToVideo` 仓库根目录，负责汇总顶层开发入口、全局命令与各大目录边界。

# 允许内容

- 仓库级说明
- 顶层目录导航
- 统一开发入口命令
- 指向 `AGENTS.md` 与 `PROJECT_MAP.md` 的说明

# 禁止内容

- 具体业务实现代码
- 某个子目录的局部实现细节
- 临时实验记录
- 与项目开发无关的操作手册

# 修改前必须阅读

- `./AGENTS.md`
- `./PROJECT_MAP.md`

# 命名规则

- 根目录说明文件：`README.md`
- 根目录规则文件：`AGENTS.md`
- 根目录结构图：`PROJECT_MAP.md`
- 顶层脚本入口：`package.json`

# 边界说明

根目录只负责顶层导航，不替代子目录 `README.md`。
任何具体代码修改，仍需继续阅读目标目录及其父目录中的 `README.md`。

# Codex 规则

- 修改根目录文件前必须阅读本 README。
- 不允许把子目录规则折叠回根目录说明。
- 如果新增顶层目录，必须补充到 `PROJECT_MAP.md`，并为该目录创建 `README.md`。
- 不允许删除空目录中的 `README.md`。

---

## 当前常用命令

```bash
npm run produce:video
npm run lint
npm run build
```

## 顶层维护目录

- `apps/`
- `packages/`
- `services/`
- `tools/`
- `data/`
- `docs/`
- `public/`

## 说明

更详细的目录职责请继续阅读：

- `./AGENTS.md`
- `./PROJECT_MAP.md`
- 各目标目录下的 `README.md`
