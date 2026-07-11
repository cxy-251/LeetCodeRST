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

内容语言
--------

题目 RST 的正文、图注、提示、警告、自检答案和代码教学注释统一使用简体中文。
LeetCode 官方英文题名、文件 slug、代码标识符、关键字、API、类型名和标准库名称
保留英文。

代码变量、函数和类型使用各语言惯用的英文命名，不使用中文标识符。完整规则见
``docs/CONTENT_LANGUAGE_POLICY.rst``。

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

JavaScript 运行时知识在 TypeScript 章节中教学；SQL 用于数据库题；Bash 或
POSIX Shell 用于 Shell 题。完整规则见 ``docs/LANGUAGE_SCOPE.rst``。

解法、基础类型与关联
--------------------

* 每题选择一个主解法，完整覆盖 10 种核心语言；
* 对照解法只在复杂度、数据结构或算法思路存在实质差异时保留；
* 标准库方案属于正式工程写法；当轮子隐藏核心算法时，同时提供教学写法；
* ``ListNode``、``TreeNode`` 等平台类型不在每道题重复定义；
* Julia 与 R 使用统一的仓库级可变节点约定；
* 语法和 API 解释写在代码块内，代码行优先不超过 88 列；
* 链表、树、图、动态规划和回溯等内容可以使用 Mermaid 表达状态变化；
* 单题关联通常保留 1 至 3 个，最多 5 个，没有强关联时直接省略。

完整规则见 ``docs/SOLUTION_AND_TYPES_POLICY.rst``、
``docs/RELATED_PROBLEMS_POLICY.rst`` 和 ``docs/RST_STYLE_GUIDE.rst``。

已完成题目
----------

#. `0001. Two Sum <problems/0001-0100/0001-two-sum.rst>`_
#. `0002. Add Two Numbers <problems/0001-0100/0002-add-two-numbers.rst>`_
#. `0003. Longest Substring Without Repeating Characters <problems/0001-0100/0003-longest-substring-without-repeating-characters.rst>`_
#. `0004. Median of Two Sorted Arrays <problems/0001-0100/0004-median-of-two-sorted-arrays.rst>`_
#. `0005. Longest Palindromic Substring <problems/0001-0100/0005-longest-palindromic-substring.rst>`_
#. `0006. Zigzag Conversion <problems/0001-0100/0006-zigzag-conversion.rst>`_
#. `0007. Reverse Integer <problems/0001-0100/0007-reverse-integer.rst>`_
#. `0008. String to Integer (atoi) <problems/0001-0100/0008-string-to-integer-atoi.rst>`_
#. `0009. Palindrome Number <problems/0001-0100/0009-palindrome-number.rst>`_
#. `0010. Regular Expression Matching <problems/0001-0100/0010-regular-expression-matching.rst>`_
#. `0011. Container With Most Water <problems/0001-0100/0011-container-with-most-water.rst>`_
#. `0012. Integer to Roman <problems/0001-0100/0012-integer-to-roman.rst>`_
#. `0013. Roman to Integer <problems/0001-0100/0013-roman-to-integer.rst>`_
#. `0014. Longest Common Prefix <problems/0001-0100/0014-longest-common-prefix.rst>`_
#. `0015. 3Sum <problems/0001-0100/0015-3sum.rst>`_
#. `0016. 3Sum Closest <problems/0001-0100/0016-3sum-closest.rst>`_
#. `0017. Letter Combinations of a Phone Number <problems/0001-0100/0017-letter-combinations-of-a-phone-number.rst>`_
#. `0018. 4Sum <problems/0001-0100/0018-4sum.rst>`_
#. `0019. Remove Nth Node From End of List <problems/0001-0100/0019-remove-nth-node-from-end-of-list.rst>`_
#. `0020. Valid Parentheses <problems/0001-0100/0020-valid-parentheses.rst>`_
#. `0021. Merge Two Sorted Lists <problems/0001-0100/0021-merge-two-sorted-lists.rst>`_
#. `0022. Generate Parentheses <problems/0001-0100/0022-generate-parentheses.rst>`_
#. `0023. Merge k Sorted Lists <problems/0001-0100/0023-merge-k-sorted-lists.rst>`_
#. `0024. Swap Nodes in Pairs <problems/0001-0100/0024-swap-nodes-in-pairs.rst>`_
#. `0025. Reverse Nodes in k-Group <problems/0001-0100/0025-reverse-nodes-in-k-group.rst>`_
#. `0026. Remove Duplicates from Sorted Array <problems/0001-0100/0026-remove-duplicates-from-sorted-array.rst>`_
#. `0027. Remove Element <problems/0001-0100/0027-remove-element.rst>`_

下一题是 ``0028. Find the Index of the First Occurrence in a String``。实际进度以
``state/PROGRESS.toml`` 为准。

开始工作
--------

任何助手或新的对话必须先阅读：

#. ``AGENTS.md``
#. ``docs/PROJECT_VISION.rst``
#. ``docs/LANGUAGE_SCOPE.rst``
#. ``docs/SOLUTION_AND_TYPES_POLICY.rst``
#. ``docs/RELATED_PROBLEMS_POLICY.rst``
#. ``docs/CONTENT_LANGUAGE_POLICY.rst``
#. ``docs/RST_STYLE_GUIDE.rst``
#. ``docs/AUTOMATION_QUALITY_GATE.rst``
#. ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``
#. ``state/PROGRESS.toml``
#. ``state/CONCEPT_LEDGER.toml``
#. 最近至少 5 道已完成题目

``AGENTS.md`` 是项目的最高执行规则。仓库文件是跨对话交接依据，不能依赖上一段
对话中的隐含记忆。

当前状态
--------

0001 至 0027 已完成。当前样板已经覆盖哈希表、链表、滑动窗口、二分分割、回文
中心扩展、周期索引、整数逐位反转、字符串解析、记忆化匹配、数组双指针、罗马数字、
公共前缀、多数和降维、最近候选、回溯、链表固定间距删除、括号栈、双路稳定归并、
合法括号前缀、最小堆 K 路归并、相邻节点交换、K 组链表反转、有序数组原地去重与
按固定目标值稳定压缩。下一题从 0028 开始；自动任务每次只精写一道题，并以 RST
教学质量高于题量。

定时自动任务复用唯一固定分支 ``automation/leetcode-current``，每轮只创建一个非 Draft PR，
通过质量检查后 squash merge 到 ``main``。禁止题号分支、时间戳分支和额外 finalize PR。
完整规则见 ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``。

文件组织
--------

::

   AGENTS.md
   README.rst
   docs/
     PROJECT_VISION.rst
     LANGUAGE_SCOPE.rst
     SOLUTION_AND_TYPES_POLICY.rst
     RELATED_PROBLEMS_POLICY.rst
     CONTENT_LANGUAGE_POLICY.rst
     RST_STYLE_GUIDE.rst
     AUTOMATION_QUALITY_GATE.rst
     AUTOMATION_DIRECT_MAIN_POLICY.rst
     PROBLEM_TEMPLATE.rst
   problems/
     README.rst
     0001-0100/
       README.rst
       0001-two-sum.rst
       ...
       0027-remove-element.rst
   state/
     PROGRESS.toml
     CONCEPT_LEDGER.toml

文档形式
--------

题目正文和项目说明以 RST 为主。仓库不建立 Sphinx、文档站点、CI 构建或发布
系统，内容以直接阅读源文件为目标。

仓库前身
--------

本仓库原用于 ``paperToVideo`` 项目。改造前 ``main`` 的最终状态保存在
``archive/paperToVideo-before-reset`` 分支中，原有阶段分支和 Git 历史继续保留。
