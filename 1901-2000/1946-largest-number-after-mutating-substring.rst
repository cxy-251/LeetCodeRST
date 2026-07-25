1946. Largest Number After Mutating Substring
============================================

题目信息
--------

:题号: 1946
:难度: Medium
:主题: 贪心、字符串
:原题: `LeetCode 1946 <https://leetcode.com/problems/largest-number-after-mutating-substring/>`_
:重点: 至多选择一个连续子串，把每位数字替换为映射值以最大化结果

题目重述
--------

给定数字字符串和十位数字的映射数组。可以选择至多一个非空连续子串，把其中每个数字 ``d`` 替换为 ``change[d]``。返回最大结果字符串。

自建示例
--------

.. code-block:: text

   输入：num = "123", change = [0,1,8,9,4,5,6,7,8,9]
   输出："189"
   解释：选择后两位，2 变为 8、3 变为 9。

.. code-block:: text

   输入：num = "42", change = [0,1,2,3,4,0,0,0,0,0]
   输出："42"
   解释：所有可替换结果都不会增大数字，因此不执行变换。
