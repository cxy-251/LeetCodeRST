LeetCode 0001–0100
==================

本目录按题号顺序保存 0001 至 0100 的题目教程。

已完成
------

#. `0001. Two Sum <0001-two-sum.rst>`_
#. `0002. Add Two Numbers <0002-add-two-numbers.rst>`_
#. `0003. Longest Substring Without Repeating Characters <0003-longest-substring-without-repeating-characters.rst>`_
#. `0004. Median of Two Sorted Arrays <0004-median-of-two-sorted-arrays.rst>`_
#. `0005. Longest Palindromic Substring <0005-longest-palindromic-substring.rst>`_
#. `0006. Zigzag Conversion <0006-zigzag-conversion.rst>`_
#. `0007. Reverse Integer <0007-reverse-integer.rst>`_
#. `0008. String to Integer (atoi) <0008-string-to-integer-atoi.rst>`_
#. `0009. Palindrome Number <0009-palindrome-number.rst>`_
#. `0010. Regular Expression Matching <0010-regular-expression-matching.rst>`_
#. `0011. Container With Most Water <0011-container-with-most-water.rst>`_
#. `0012. Integer to Roman <0012-integer-to-roman.rst>`_
#. `0013. Roman to Integer <0013-roman-to-integer.rst>`_
#. `0014. Longest Common Prefix <0014-longest-common-prefix.rst>`_
#. `0015. 3Sum <0015-3sum.rst>`_
#. `0016. 3Sum Closest <0016-3sum-closest.rst>`_
#. `0017. Letter Combinations of a Phone Number <0017-letter-combinations-of-a-phone-number.rst>`_
#. `0018. 4Sum <0018-4sum.rst>`_
#. `0019. Remove Nth Node From End of List <0019-remove-nth-node-from-end-of-list.rst>`_
#. `0020. Valid Parentheses <0020-valid-parentheses.rst>`_
#. `0021. Merge Two Sorted Lists <0021-merge-two-sorted-lists.rst>`_
#. `0022. Generate Parentheses <0022-generate-parentheses.rst>`_
#. `0023. Merge k Sorted Lists <0023-merge-k-sorted-lists.rst>`_
#. `0024. Swap Nodes in Pairs <0024-swap-nodes-in-pairs.rst>`_
#. `0025. Reverse Nodes in k-Group <0025-reverse-nodes-in-k-group.rst>`_
#. `0026. Remove Duplicates from Sorted Array <0026-remove-duplicates-from-sorted-array.rst>`_
#. `0027. Remove Element <0027-remove-element.rst>`_
#. `0028. Find the Index of the First Occurrence in a String <0028-find-the-index-of-the-first-occurrence-in-a-string.rst>`_
#. `0029. Divide Two Integers <0029-divide-two-integers.rst>`_
#. `0030. Substring with Concatenation of All Words <0030-substring-with-concatenation-of-all-words.rst>`_
#. `0031. Next Permutation <0031-next-permutation.rst>`_
#. `0032. Longest Valid Parentheses <0032-longest-valid-parentheses.rst>`_
#. `0033. Search in Rotated Sorted Array <0033-search-in-rotated-sorted-array.rst>`_
#. `0034. Find First and Last Position of Element in Sorted Array <0034-find-first-and-last-position-of-element-in-sorted-array.rst>`_
#. `0035. Search Insert Position <0035-search-insert-position.rst>`_
#. `0036. Valid Sudoku <0036-valid-sudoku.rst>`_
#. `0037. Sudoku Solver <0037-sudoku-solver.rst>`_
#. `0038. Count and Say <0038-count-and-say.rst>`_
#. `0039. Combination Sum <0039-combination-sum.rst>`_
#. `0040. Combination Sum II <0040-combination-sum-ii.rst>`_
#. `0041. First Missing Positive <0041-first-missing-positive.rst>`_
#. `0042. Trapping Rain Water <0042-trapping-rain-water.rst>`_
#. `0043. Multiply Strings <0043-multiply-strings.rst>`_
#. `0044. Wildcard Matching <0044-wildcard-matching.rst>`_
#. `0045. Jump Game II <0045-jump-game-ii.rst>`_
#. `0046. Permutations <0046-permutations.rst>`_
#. `0047. Permutations II <0047-permutations-ii.rst>`_
#. `0048. Rotate Image <0048-rotate-image.rst>`_
#. `0049. Group Anagrams <0049-group-anagrams.rst>`_
#. `0050. Pow(x, n) <0050-powx-n.rst>`_

阶段状态
--------

``0001`` 至 ``0050`` 的首轮教程与逐题规则提炼均已完成。

最终前向规则见 ``../../docs/FORWARD_RULES_0051_0100.rst``，审查索引见
``../../state/REVIEW_INDEX.toml``。

下一内容批次
------------

下一题为 ``0051. N-Queens``。0051 与 0052 均为 Hard，因此下一批只处理 0051。

0046–0050 提炼重点
------------------

* 阶乘容量、叶子快照和 C 多层分配形成完整资源契约；
* 区分执行期临时修改、返回前恢复和调用后持久修改；
* 重复值排列同时跟踪数值等价与输入下标身份；
* 矩阵变换通过可逆双射和坐标复合证明；
* 复杂度简化前证明规模变量之间的支配关系；
* 复合签名证明单射和固定缓冲区容量；
* 浮点数学题明确特殊输入域与 IEEE 754 误差语义；
* Julia ``a:b`` 在 ``a>b`` 时为空，递减遍历使用显式负步长。

关联题目
--------

单题保留 1 至 3 个最强关联，最多 5 个。完整规则见
``../../docs/RELATED_PROBLEMS_POLICY.rst``。
