1720. Decode XORed Array
========================

题目信息
--------

:题号: 1720
:难度: Easy
:主题: 位运算、前缀恢复
:原题: `LeetCode 1720 <https://leetcode.com/problems/decode-xored-array/>`_
:重点: ``encoded[i] = arr[i] XOR arr[i+1]``，已知首元素后依次恢复

题目重述
--------

给定异或编码数组和原数组首元素 ``first``。返回唯一原数组。

自建示例
--------

.. code-block:: text

   输入：encoded = [1,2,3], first = 1
   输出：[1,0,2,1]
   解释：后续元素依次由前一原值与当前编码异或得到。

.. code-block:: text

   输入：encoded = [0], first = 5
   输出：[5,5]
   解释：两个相同数的异或结果为零。