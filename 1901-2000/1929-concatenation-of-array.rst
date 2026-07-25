1929. Concatenation of Array
============================

题目信息
--------

:题号: 1929
:难度: Easy
:主题: 数组、模拟
:原题: `LeetCode 1929 <https://leetcode.com/problems/concatenation-of-array/>`_
:重点: 返回数组与自身首尾拼接的结果

题目重述
--------

给定数组 ``nums``，构造长度两倍的数组，前半和后半都等于 ``nums``。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2]
   输出：[1,2,1,2]
   解释：把原数组复制两次并连接。

.. code-block:: text

   输入：nums = [0]
   输出：[0,0]
   解释：单元素数组拼接自身得到两个零。
