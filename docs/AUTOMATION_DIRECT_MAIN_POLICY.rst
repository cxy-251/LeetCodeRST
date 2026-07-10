自动任务固定分支策略
====================

兼容说明
--------

本文件保留原路径 ``AUTOMATION_DIRECT_MAIN_POLICY.rst``，供既有任务继续读取。实际策略已由
直接更新 ``main`` 改为复用单一固定分支，因为无人值守任务无法稳定完成底层 Git tree 与
``main`` ref 的原子更新，而分支、PR 与 squash merge 流程已经验证可用。

规则优先级
----------

本规则只适用于用户明确授权的 LeetCode 定时自动任务，并与
``docs/AUTOMATION_QUALITY_GATE.rst`` 共同构成自动任务的最高执行规则。自动任务遇到
``AGENTS.md`` 中“直接提交 main”或“多题批次”的一般规则时，以本文件的“单题、固定分支、
单 PR”规则为准。普通人工协作继续遵守 ``AGENTS.md``。

核心原则
--------

* 每次运行只处理 ``state/PROGRESS.toml`` 中 ``next_problem`` 指向的一道题；
* 不按难度积分组批，不提前编写后续题目；
* 永远只使用固定分支 ``automation/leetcode-current``；
* 禁止创建带题号、时间戳、批次号或随机后缀的新分支；
* 同一时刻最多存在一个由该任务创建的开放 PR；
* RST 教学质量优先于运行时间和产量；
* 当前题未达到 ``docs/AUTOMATION_QUALITY_GATE.rst`` 时，本轮不得提交。

开始前同步
----------

每轮开始时：

#. 读取最新 ``main`` 和 ``state/PROGRESS.toml``；
#. 检查 ``automation/leetcode-current`` 是否存在；
#. 若存在，将该分支快进或重置到最新 ``main``；
#. 若不存在，从最新 ``main`` 创建该固定分支；
#. 若该固定分支仍有未关闭 PR，停止本轮并报告，不得再创建其他分支。

单题提交范围
------------

提交前一次性准备并检查：

#. 当前题的完整 RST；
#. 当前范围目录的 ``README.rst``；
#. 根目录 ``README.rst``；
#. ``state/PROGRESS.toml``；
#. ``state/CONCEPT_LEDGER.toml``。

所有文件必须彼此一致。不得先提交题目文件，再等待后续任务补索引或状态。
``PROGRESS.toml`` 不得记录本轮提交自身 SHA，避免为了回填 SHA 创建第二个提交或 PR。

PR 与合并
---------

#. 只向 ``automation/leetcode-current`` 写入本题相关文件；
#. 创建一个非 Draft PR，目标分支为 ``main``；
#. 检查 PR 只包含当前一道题及必要索引和状态文件；
#. 质量门全部通过后执行 squash merge；
#. 禁止创建第二个“finalize”“state”“fixup”分支或 PR；
#. 合并后保留该固定分支供下轮复用，或由仓库自动删除后在下轮用同名重建。

写入后验证
----------

合并后重新读取最新 ``main``，确认：

* 当前题文件存在；
* 只新增当前一道题；
* ``next_problem`` 恰好增加一；
* 完成数量和范围正确；
* 根 README、范围索引和知识账本已经同步；
* 本轮最多使用 ``automation/leetcode-current`` 一个分支；
* 本轮只有一个内容 PR，没有额外 finalize PR。

任一验证失败都必须报告异常，并暂停后续自动运行。
