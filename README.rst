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
#. `0028. Find the Index of the First Occurrence in a String <problems/0001-0100/0028-find-the-index-of-the-first-occurrence-in-a-string.rst>`_
#. `0029. Divide Two Integers <problems/0001-0100/0029-divide-two-integers.rst>`_
#. `0030. Substring with Concatenation of All Words <problems/0001-0100/0030-substring-with-concatenation-of-all-words.rst>`_
#. `0031. Next Permutation <problems/0001-0100/0031-next-permutation.rst>`_
#. `0032. Longest Valid Parentheses <problems/0001-0100/0032-longest-valid-parentheses.rst>`_
#. `0033. Search in Rotated Sorted Array <problems/0001-0100/0033-search-in-rotated-sorted-array.rst>`_
#. `0034. Find First and Last Position of Element in Sorted Array <problems/0001-0100/0034-find-first-and-last-position-of-element-in-sorted-array.rst>`_
#. `0035. Search Insert Position <problems/0001-0100/0035-search-insert-position.rst>`_
#. `0036. Valid Sudoku <problems/0001-0100/0036-valid-sudoku.rst>`_
#. `0037. Sudoku Solver <problems/0001-0100/0037-sudoku-solver.rst>`_
#. `0038. Count and Say <problems/0001-0100/0038-count-and-say.rst>`_
#. `0039. Combination Sum <problems/0001-0100/0039-combination-sum.rst>`_
#. `0040. Combination Sum II <problems/0001-0100/0040-combination-sum-ii.rst>`_
#. `0041. First Missing Positive <problems/0001-0100/0041-first-missing-positive.rst>`_
#. `0042. Trapping Rain Water <problems/0001-0100/0042-trapping-rain-water.rst>`_
#. `0043. Multiply Strings <problems/0001-0100/0043-multiply-strings.rst>`_
#. `0044. Wildcard Matching <problems/0001-0100/0044-wildcard-matching.rst>`_
#. `0045. Jump Game II <problems/0001-0100/0045-jump-game-ii.rst>`_
#. `0046. Permutations <problems/0001-0100/0046-permutations.rst>`_
#. `0047. Permutations II <problems/0001-0100/0047-permutations-ii.rst>`_
#. `0048. Rotate Image <problems/0001-0100/0048-rotate-image.rst>`_
#. `0049. Group Anagrams <problems/0001-0100/0049-group-anagrams.rst>`_
#. `0050. Pow(x, n) <problems/0001-0100/0050-powx-n.rst>`_

0001 至 0050 的首轮教程已经完成。实际审查状态以 ``state/PROGRESS.toml`` 为准。

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

0001 至 0050 的首轮多语言 RST 已全部完成。内容已经覆盖哈希表、链表、滑动窗口、二分、
回文、字符串解析、动态规划、数组双指针、整数边界、回溯、栈、堆、链表局部变换、
有序数组原地压缩、固定词长窗口、排列、数独、游程编码、组合搜索、循环置换、蓄水、
字符串竖式乘法、通配符回退、BFS 层边界、矩阵坐标变换、异位词频次签名和二进制快速幂。

当前阶段为 ``0001–0050`` 全量审查。后续需要逐个核对每个 RST 的题意、主算法、正确性证明、
复杂度、十语言编译与运行、语言边界、内存所有权、索引语义、知识账本和文件间一致性。
在用户明确解除审查检查点前，禁止生成 0051 或更大题号。

定时自动任务只在深夜运行。任务读取到 ``next_problem >= 51`` 时不得写仓库，只报告已到审查
检查点并等待用户明确解除。

0050 审查检查点
---------------

审查范围固定为 ``0001`` 至 ``0050``。发现确定性缺陷时使用独立 ``fix:`` PR 修复，修复 PR
不得新增题目或推进题号。完成逐文件审查并由用户明确确认后，才能进入 0051。

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
       0050-powx-n.rst
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
