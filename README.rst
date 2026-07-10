LeetCode 多语言 RST 学习仓库
============================

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。

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
#. ``docs/RST_STYLE_GUIDE.rst``
#. ``state/PROGRESS.toml``
#. ``state/CONCEPT_LEDGER.toml``
#. 最近至少 5 道已完成题目

``AGENTS.md`` 是项目的最高执行规则。仓库文件是跨对话交接依据，不能依赖上一段对话中的隐含记忆。

当前状态
--------

当前处于基础系统阶段。下一步从 LeetCode 0001 开始制作少量样板题，先稳定语言范围、讲解层级、注释密度和 RST 结构，再扩大批次。

本项目直接在 ``main`` 上推进。除非用户明确要求，不创建分支或 PR。

文件组织
--------

::

   AGENTS.md
   README.rst
   docs/
     PROJECT_VISION.rst
     RST_STYLE_GUIDE.rst
     PROBLEM_TEMPLATE.rst
   problems/
     README.rst
     0001-0100/
     0101-0200/
   state/
     PROGRESS.toml
     CONCEPT_LEDGER.toml

文档形式
--------

题目正文和项目说明以 RST 为主。仓库不建立 Sphinx、文档站点、CI 构建或发布系统，内容以直接阅读源文件为目标。

仓库前身
--------

本仓库原用于 ``paperToVideo`` 项目。改造前 ``main`` 的最终状态保存在 ``archive/paperToVideo-before-reset`` 分支中，原有阶段分支和 Git 历史继续保留。