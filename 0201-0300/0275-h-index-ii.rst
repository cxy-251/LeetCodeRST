0275. H-Index II
================

题目信息
--------

:题号: 0275
:难度: Medium
:主题: 数组、二分查找
:原题: `LeetCode 0275 <https://leetcode.com/problems/h-index-ii/>`_
:教学重点: 有序数组、答案单调性、下标到论文数映射

题目重述
--------

给定按非递减顺序排列的引用次数数组 ``citations``，接口为 ``int hIndex(vector<int>& citations)``。返回最大 H 指数。数组长度最多约 ``10^5``；应利用有序性获得对数时间，结果只取最大可行整数，输入不修改。

自建示例
--------

.. code-block:: text

   输入：[0,1,4,5,6]
   输出：3
