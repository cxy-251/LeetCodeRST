LeetCode 多语言 RST 学习仓库
============================

本仓库正在重建为一套按 LeetCode 题号顺序推进的多语言算法学习资料。

项目目标
--------

* 每道可访问题目对应一个 ``.rst`` 文件。
* 按题号递增推进，让不同算法主题自然交错，形成间隔复习。
* 同时学习算法与多种编程语言。
* 语法知识采用解释衰减，疑难算法采用周期性复现。
* 题目内容使用原创重述，不复制平台完整题干与官方题解。
* 无法访问的 Premium 题目登记后跳过，后续有合法材料时再补写。

开始工作
--------

任何助手或新的对话必须先阅读：

#. ``AGENTS.md``
#. ``docs/PROJECT_VISION.rst``
#. ``state/PROGRESS.toml``
#. ``state/CONCEPT_LEDGER.toml``

``AGENTS.md`` 是项目的最高执行规则。

当前阶段
--------

当前 PR 只建立项目契约、教学原则、跨对话状态和题目模板。下一阶段从 LeetCode 0001 开始制作少量样板题，稳定语言范围、注释密度和 RST 结构后再扩大批次。

目录规划
--------

::

   AGENTS.md
   README.rst
   docs/
     PROJECT_VISION.rst
     PROBLEM_TEMPLATE.rst
   problems/
     0001-0100/
     0101-0200/
   state/
     PROGRESS.toml
     CONCEPT_LEDGER.toml

仓库历史中的旧 paperToVideo 内容已在本重建分支中移除。旧提交仍保留在 Git 历史中，需要时可以回溯。
