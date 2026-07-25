1893. Check if All the Integers in a Range Are Covered
=====================================================

题目信息
--------

:题号: 1893
:难度: Easy
:主题: 区间、前缀和
:原题: `LeetCode 1893 <https://leetcode.com/problems/check-if-all-the-integers-in-a-range-are-covered/>`_
:重点: 检查闭区间 ``[left,right]`` 内每个整数是否至少被一个范围覆盖

题目重述
--------

给定若干整数闭区间，判断从 ``left`` 到 ``right`` 的每个整数是否都落在至少一个区间内。

自建示例
--------

.. code-block:: text

   输入：ranges = [[1,2],[3,5]], left = 2, right = 4
   输出：true
   解释：2、3、4 都被覆盖。

.. code-block:: text

   输入：ranges = [[1,1]], left = 1, right = 2
   输出：false
   解释：整数 2 未被覆盖。
