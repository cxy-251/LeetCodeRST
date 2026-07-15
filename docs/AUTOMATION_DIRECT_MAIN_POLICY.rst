对话驱动执行流程
================

文件定位
--------

所有题解生成、审查、修复、规则归并和产物归档都由用户在当前对话中的明确消息触发，并在当前回复周期内
完成。仓库状态承担跨对话交接，不依赖后台任务。

本仓库只允许直接更新 ``main``。任何任务都不得创建临时分支、工作分支、PR、上传分片分支或临时组装
工作流。具体命令和失败边界见 ``docs/CODEX_GIT_WORKFLOW.rst``。

执行入口
--------

* ``state/PROGRESS.toml``：当前阶段和下一步；
* ``state/REVIEW_INDEX.toml``：active corrections 与归档索引；
* 当前阶段完整前向规则；
* ``state/CONCEPT_LEDGER.toml``：知识进度；
* README、模板、质量门和题目 RST：当前工作上下文；
* ``archive/``：仅用于历史证据追溯。

标准工作流
----------

每轮工作按以下顺序执行：

#. **读取最新状态**

   从最新 ``main`` 读取 ``AGENTS.md``、根 README、``PROGRESS``、``REVIEW_INDEX``、当前阶段规则、质量门
   以及本轮直接相关题目。

#. **确定本轮范围**

   根据用户指令和状态确定唯一审查范围、生成题号、修复对象或归档范围。

#. **准备完整结果**

   Codex 直接编辑工作区中的正式正文、代码、规则、索引和状态文件。一次性推演或检查材料只放在系统临时
   目录，普通生成任务不创建可由正式正文完全推导的一次性报告。

#. **执行质量检查**

   对照 ``docs/AUTOMATION_QUALITY_GATE.rst``、当前前向规则和专项策略检查内容、证明、复杂度、十语言实现、
   文件路径和状态一致性。

#. **执行产物生命周期处理**

   删除 marker、草稿、日志和无证据价值的临时文件。已被正式规则吸收但仍有追溯价值的批次状态、findings、
   历史规则和归并记录移入 ``archive``，并更新 manifest 与全部活动引用。

#. **重新确认主分支**

   开始工作和提交前执行 ``git fetch origin main``，比较 ``HEAD``、工作基线和 ``origin/main``。若远端在
   工作期间变化，停止提交并基于最新 ``main`` 重新核对修改，禁止强行覆盖并发更新。

#. **形成原子提交并推送**

   使用 ``git add -- <本轮明确文件>`` 显式暂存，检查 ``git diff --cached`` 后执行一次标准 ``git commit``。
   再使用非强制 ``git push origin main`` 发布。禁止 ``git add .``、额外中间提交和 force push。

#. **复查提交结果**

   重新读取本地 ``main`` 与 ``origin/main``，确认两者指向同一提交，并核对范围、README、规则、状态账本、
   活动目录和 archive manifest 一致。

#. **报告并结束本轮**

   在当前对话中报告实际完成内容、提交结果和下一步。

新题生成流程
------------

#. 从 ``state/PROGRESS.toml`` 的 ``next_problem`` 开始；
#. 根据用户范围或难度预算确定连续题号；
#. 完成原创重述、示例、算法选择、正确性证明、复杂度和十语言实现；
#. 应用当前阶段完整前向规则；
#. 同步题目 RST、范围 README、根 README、``PROGRESS`` 和知识账本；
#. 不保留一次性分析稿、代码摘录副本或临时静态审查报告；
#. 完成质量门后直接在 ``main`` 形成一个原子提交。

逐题审查流程
------------

审查轮次进行期间可以在同一个 ``main`` 原子提交中创建：

* ``state/reviews/NNNN-NNNN.toml``；
* ``docs/review-findings/NNNN-NNNN.rst``。

这些文件是活动阶段证据。整轮审查完成并形成下一阶段完整规则后，同一 ``main`` 归并提交必须：

#. 把稳定规则写入自包含前向规则；
#. 把 active corrections 保留在 ``state/REVIEW_INDEX.toml``；
#. 把批次状态、findings、目录和归并记录移入 ``archive/reviews/<range>/``；
#. 清空活动的 ``state/reviews`` 与 ``docs/review-findings`` 已消费范围；
#. 更新 archive manifest 和所有活动入口。

历史题修复流程
--------------

#. 读取该题完整 RST、active correction 和当前规则；
#. 通过对应 archive manifest 定位历史审查证据；
#. 明确缺陷类别；
#. 只修改该题和确实受影响的公共文件；
#. 使用针对性静态审查；
#. 直接在 ``main`` 形成独立原子提交；
#. 保持题号进度不变。

Git 使用方式
------------

正式和实现语义完全一致：每轮只产生一个直接进入 ``main`` 的原子提交。

禁止以下行为：

* 创建临时分支或工作分支；
* 创建 PR，包括草稿 PR；
* 创建上传分片分支；
* 通过 GitHub Actions 或其他临时工作流组装正式文件；
* 在 ``main`` 连续写入多个中间提交后再补救；
* 使用强制更新覆盖未知的主分支变化。

Codex 使用标准本地 Git：

#. ``git fetch origin main`` 并确认当前分支为 ``main``、工作基线不落后于 ``origin/main``；
#. ``git add -- <本轮明确文件>``，禁止 ``git add .``；
#. 检查 ``git diff --cached --stat`` 和完整暂存差异；
#. ``git commit -m <message>``，每轮只创建一个提交；
#. ``git push origin main``，禁止 ``--force`` 和 ``--force-with-lease``；
#. 确认 ``HEAD`` 与 ``origin/main`` 一致且工作树干净。

标准 ``git commit`` 已在内部原子生成 blob、tree 和 commit，无需 Codex 手工调用对象接口。

并发处理
--------

开始和提交前都获取远端 ``main``。如果远端在准备期间变化，停止提交并以新状态重新核对本轮范围和目标文件，
不得覆盖他人已经推送的修改。若 ``git push origin main`` 被拒绝，不得强推；保留现场并如实报告。

完成判定
--------

一轮工作只有在用户范围、正文代码、质量检查、状态同步、产物清理、归档索引、单个 ``main`` 原子提交和
提交后复查全部完成时才结束。
