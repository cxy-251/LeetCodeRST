1844. Replace All Digits with Characters
========================================

题目信息
--------

:题号: 1844
:难度: Easy
:主题: 字符串、字符运算
:原题: `LeetCode 1844 <https://leetcode.com/problems/replace-all-digits-with-characters/>`_
:重点: 奇数下标数字表示前一个字母向后偏移的位数

题目重述
--------

字符串偶数下标为小写字母、奇数下标为数字。把每个数字替换为其前一个字母向后移动对应位数得到的字符。

自建示例
--------

.. code-block:: text

   输入：s = "a1c1e1"
   输出："abcdef"
   解释：三个数字 1 分别把 a、c、e 转换为 b、d、f。

.. code-block:: text

   输入：s = "x0"
   输出："xx"
   解释：偏移量为 0，字符仍为 x。
