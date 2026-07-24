1147. Longest Chunked Palindrome Decomposition
==============================================

题目信息
--------

:题号: 1147
:难度: Hard
:主题: 字符串、分块回文、贪心
:原题: `LeetCode 1147 <https://leetcode.com/problems/longest-chunked-palindrome-decomposition/>`_
:重点: 把整个字符串分成连续非空块，首尾对应块文本相同；返回能够得到的最大块数

题目重述
--------

给定字符串 ``text``。需要把它完整划分为 ``k`` 个连续且非空的子串 ``subtext1, subtext2, ..., subtextk``，连接后仍恰好等于原字符串。

若对于每个合法下标 ``i`` 都有 ``subtext_i == subtext_(k-i+1)``，则该划分是分块回文分解。请返回所有合法分解中最大的块数 ``k``。

``1 <= text.length <= 1000``，``text`` 只包含小写英文字母。

自建示例
--------

首尾可以使用多字符块：

.. code-block:: text

   输入：text = "volvo"
   输出：3
   解释：可以分成 "vo"、"l"、"vo"，首尾块相同，因此得到三块；无法继续把首尾拆成更多相互对应的非空块。

单字符字符串：

.. code-block:: text

   输入：text = "x"
   输出：1
   解释：整个字符串自身构成唯一的非空块。