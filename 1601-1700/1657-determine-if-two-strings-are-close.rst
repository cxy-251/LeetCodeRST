1657. Determine if Two Strings Are Close
========================================

题目信息
--------

:题号: 1657
:难度: Medium
:主题: 字符串、频次、多重集合
:原题: `LeetCode 1657 <https://leetcode.com/problems/determine-if-two-strings-are-close/>`_
:重点: 可交换任意位置，也可整体交换两种已有字符；要求字符集合相同且频次多重集合相同

题目重述
--------

判断两个字符串能否通过任意位置交换，以及把所有某字符与另一已有字符互换的操作相互转换。

自建示例
--------

.. code-block:: text

   输入：word1 = "abbccc", word2 = "cccbba"
   输出：true
   解释：字符集合和各字符频次完全一致。

.. code-block:: text

   输入：word1 = "aa", word2 = "bb"
   输出：false
   解释：两个字符串包含的字符集合不同，不能引入新字符。