1647. Minimum Deletions to Make Character Frequencies Unique
============================================================

题目信息
--------

:题号: 1647
:难度: Medium
:主题: 字符串、频次、贪心
:原题: `LeetCode 1647 <https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/>`_
:重点: 删除字符后，所有仍出现字符的正频次必须两两不同

题目重述
--------

给定小写字符串。每次可删除一个字符，返回使不同字符出现次数互不相同所需的最少删除次数。

自建示例
--------

.. code-block:: text

   输入：s = "aaabbbcc"
   输出：2
   解释：可把频次 3、3、2 调整为 3、2、1。

.. code-block:: text

   输入：s = "abc"
   输出：2
   解释：三个频次均为 1，只能保留其中一个字符。