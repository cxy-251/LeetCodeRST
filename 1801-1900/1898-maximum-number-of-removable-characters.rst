1898. Maximum Number of Removable Characters
============================================

题目信息
--------

:题号: 1898
:难度: Medium
:主题: 二分查找、双指针、子序列
:原题: `LeetCode 1898 <https://leetcode.com/problems/maximum-number-of-removable-characters/>`_
:重点: 依次删除 ``removable`` 的前若干下标，同时保持 ``p`` 为 ``s`` 的子序列

题目重述
--------

按 ``removable`` 给出的顺序删除 ``s`` 中字符。返回最多能删除前多少个位置，仍使字符串 ``p`` 是剩余字符串的子序列。

自建示例
--------

.. code-block:: text

   输入：s = "abcacb", p = "ab", removable = [3,1,0]
   输出：2
   解释：删除下标 3 和 1 后仍可用下标 0、5 得到 "ab"；再删除下标 0 则失败。

.. code-block:: text

   输入：s = "abc", p = "abc", removable = [1]
   输出：0
   解释：删除任意一个字符都会破坏完整子序列。
