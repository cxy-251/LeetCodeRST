1829. Maximum XOR for Each Query
===============================

题目信息
--------

:题号: 1829
:难度: Medium
:主题: 位运算、前缀异或
:原题: `LeetCode 1829 <https://leetcode.com/problems/maximum-xor-for-each-query/>`_
:重点: 每轮选择受位数限制的 ``k`` 最大化当前总异或，再移除末尾元素

题目重述
--------

对数组执行多轮查询。每轮选择 ``0 <= k < 2^maximumBit``，使当前全部元素异或再与 ``k`` 异或后的值最大；记录 ``k`` 后删除当前数组最后一个元素。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3], maximumBit = 2
   输出：[3,0,2]
   解释：三轮当前异或依次为 0、3、1，对应最优补码为 3、0、2。

.. code-block:: text

   输入：nums = [0], maximumBit = 1
   输出：[1]
   解释：允许选择 0 或 1，选择 1 可得到最大异或值 1。
