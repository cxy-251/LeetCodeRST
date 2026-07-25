1985. Find the Kth Largest Integer in the Array
==============================================

题目信息
--------

:题号: 1985
:难度: Medium
:主题: 字符串、排序、堆
:原题: `LeetCode 1985 <https://leetcode.com/problems/find-the-kth-largest-integer-in-the-array/>`_
:重点: 数字可能超出内置整数范围，应按数值而非字典序比较

题目重述
--------

数组中的每个字符串表示不含前导零的非负整数。按数值从大到小排列，返回第 ``k`` 大的字符串；重复值分别计数。

自建示例
--------

.. code-block:: text

   输入：nums = ["3","10","2"], k = 2
   输出："3"
   解释：数值顺序为 10、3、2。

.. code-block:: text

   输入：nums = ["1"], k = 1
   输出："1"
   解释：唯一元素就是第一大。
