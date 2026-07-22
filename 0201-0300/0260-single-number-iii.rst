0260. Single Number III
=======================

题目信息
--------

:题号: 0260
:难度: Medium
:主题: 位运算、数组
:原题: `LeetCode 0260 <https://leetcode.com/problems/single-number-iii/>`_
:教学重点: 总异或、最低差异位、二组划分

题目重述
--------

给定整数数组 ``nums``，恰有两个元素只出现一次，其余元素均出现两次，接口为 ``vector<int> singleNumber(vector<int>& nums)``。返回这两个唯一元素，顺序不限。数组长度最多约 ``3 * 10^4``，要求线性时间和常数额外空间，输入不修改。

自建示例
--------

.. code-block:: text

   输入：[4,1,4,6,1,9]
   输出：[6,9]
