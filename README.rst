LeetCode 多语言 RST 学习仓库
============================

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。

项目目标
--------

* 每道可访问题目对应一个 ``.rst`` 文件；
* 按题号递增推进，让不同算法主题自然交错，形成间隔复习；
* 同时学习算法与多种编程语言；
* 语法知识采用解释衰减，疑难算法采用周期性复现；
* 题目内容使用原创重述，不复制平台完整题干与官方题解；
* 无法访问的 Premium 题目登记后跳过，后续有合法材料时再补写。

固定核心语言
------------

普通算法题默认覆盖：

* C；
* C++；
* Python；
* Java；
* Rust；
* Go；
* TypeScript；
* C#；
* Julia；
* R。

JavaScript 运行时知识在 TypeScript 章节中教学；SQL 用于数据库题；Bash 或 POSIX Shell 用于 Shell 题。完整规则见 ``docs/LANGUAGE_SCOPE.rst``。

解法与基础类型
--------------

* 每题选择一个主解法，完整覆盖 10 种核心语言；
* 对照解法只在复杂度、数据结构或算法思路存在实质差异时保留；
* 标准库方案属于正式工程写法；当轮子隐藏核心算法时，同时提供教学写法；
* ``ListNode``、``TreeNode`` 等平台类型不在每道题重复定义；
* Julia 与 R 使用统一的仓库级可变节点约定；
* 语法和 API 解释写在代码块内，代码行优先不超过 88 列；
* 链表、树、图、动态规划和回溯等内容可以使用 Mermaid 表达状态变化。

完整规则见 ``docs/SOLUTION_AND_TYPES_POLICY.rst`` 和 ``docs/RST_STYLE_GUIDE.rst``。

开始工作
--------

任何助手或新的对话必须先阅读：

#. ``AGENTS.md``
#. ``docs/PROJECT_VISION.rst``
#. ``docs/LANGUAGE_SCOPE.rst``
#. ``docs/SOLUTION_AND_TYPES_POLICY.rst``
#. ``docs/RST_STYLE_GUIDE.rst``
#. ``state/PROGRESS.toml``
#. ``state/CONCEPT_LEDGER.toml``
#. 最近至少 5 道已完成题目

``AGENTS.md`` 是项目的最高执行规则。仓库文件是跨对话交接依据，不能依赖上一段对话中的隐含记忆。

当前状态
--------

基础规则已经完成。下一步从 LeetCode 0001 开始制作少量样板题，先稳定十种核心语言的写法、主解法与对照解法的比例、注释密度、基础类型复用和 Mermaid 表达，再扩大批次。

本项目直接在 ``main`` 上推进。除非用户明确要求，不创建分支或 PR。

文件组织
--------

::

   AGENTS.md
   README.rst
   docs/
     PROJECT_VISION.rst
     LANGUAGE_SCOPE.rst
     SOLUTION_AND_TYPES_POLICY.rst
     RST_STYLE_GUIDE.rst
     PROBLEM_TEMPLATE.rst
   problems/
     README.rst
     0001-0100/
   state/
     PROGRESS.toml
     CONCEPT_LEDGER.toml

文档形式
--------

题目正文和项目说明以 RST 为主。仓库不建立 Sphinx、文档站点、CI 构建或发布系统，内容以直接阅读源文件为目标。

仓库前身
--------

本仓库原用于 ``paperToVideo`` 项目。改造前 ``main`` 的最终状态保存在 ``archive/paperToVideo-before-reset`` 分支中，原有阶段分支和 Git 历史继续保留。