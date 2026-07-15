Codex 标准 Git 原子工作流
==========================

文件定位
--------

本文件说明 Codex 在本地工作区直接维护本仓库时使用的 Git 流程。它替代为 ChatGPT/GitHub Data API
设计的手工 blob、tree、commit、ref 组装方式。

仓库仍只允许直接更新 ``main``，每轮只产生一个原子提交。标准 ``git commit`` 已经在内部创建所需的
Git 对象，无需手工调用 ``git write-tree``、``git commit-tree`` 或 ``git update-ref``。

开始前
------

#. 确认当前目录是仓库根目录，当前分支是 ``main``。
#. 运行 ``git status --short --branch``，识别已有用户修改；不得覆盖或顺手提交无关变化。
#. 运行 ``git fetch origin main``。
#. 比较 ``HEAD`` 与 ``origin/main``。工作树干净且本地落后时，只允许 fast-forward 同步。
#. 读取最新 ``PROGRESS``、批次合同和本轮权威规则后再开始编辑。

编辑与检查
----------

Codex 直接修改工作区内的正式文件。一次性推演、日志和中间材料只放在系统临时目录，不进入仓库。

提交前必须：

#. 完成本轮内容质量门和静态审查；
#. 清除 marker、草稿、缓存和一次性文件；
#. 重新执行 ``git fetch origin main``；
#. 确认远端仍是本轮开始时的基线；
#. 使用 ``git diff --check`` 和必要的 RST、TOML、目录、状态一致性检查；
#. 使用 ``git diff --name-only`` 确认修改范围。

若远端在工作期间变化，停止提交，重新读取最新状态并核对本轮修改。不得通过 force push 抢占远端。

暂存与提交
----------

只暂存本轮明确文件：

.. code-block:: bash

   git add -- path/to/file1 path/to/file2
   git diff --cached --stat
   git diff --cached
   git commit -m "<type>: <summary>"

禁止 ``git add .`` 和 ``git add -A``，避免把用户已有修改或临时产物带入提交。

每轮只允许一次 ``git commit``。如果提交前发现问题，继续修改并重新暂存；不得先提交半成品，再用第二个
提交补救。

推送
----

提交复查通过后执行：

.. code-block:: bash

   git push origin main

禁止：

* ``git push --force``；
* ``git push --force-with-lease``；
* 创建临时分支、工作分支或上传分片分支；
* 创建 PR，包括草稿 PR；
* 通过临时 GitHub Actions 工作流组装正式文件。

普通非强制 push 被拒绝时，说明远端已经变化。Codex 必须停止，不得强推；保留现场并向用户报告，随后基于
最新 ``main`` 重新核对。

提交后复查
----------

#. 确认 ``git status --short --branch`` 显示工作树干净且没有 ahead/behind；
#. 确认 ``git rev-parse HEAD`` 与 ``git rev-parse origin/main`` 一致；
#. 使用 ``git show --stat --oneline HEAD`` 检查提交范围；
#. 重新读取 ``PROGRESS``、批次合同和下一步；
#. 对话报告说明提交 ID、实际文件范围、静态审查范围、剩余风险和下一批。

并发与失败边界
--------------

标准 Git 的非强制 push 已提供并发保护。Codex 不需要手工移动 ref，也不能用 reset、force push 或覆盖用户
修改来消除冲突。

若提交已在本地创建但推送失败，应保留该提交并报告失败原因。后续处理必须先确认远端新状态，再选择安全的
fast-forward、重新应用修改或请求用户决定；不得擅自改写公开历史。

完成判定
--------

本轮只有在内容与状态通过质量门、明确文件被单次提交、提交非强制推送到 ``origin/main``、本地远端一致且
工作树干净后才算完成。
