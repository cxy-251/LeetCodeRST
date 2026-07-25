1945. Sum of Digits of String After Convert
===========================================

题目信息
--------

:题号: 1945
:难度: Easy
:主题: 字符串、模拟
:原题: `LeetCode 1945 <https://leetcode.com/problems/sum-of-digits-of-string-after-convert/>`_
:重点: 字母先转换为 1 到 26，再重复执行数字和操作 ``k`` 次

题目重述
--------

把每个小写字母替换为其字母表位置并连接成数字字符串，然后执行 ``k`` 次各位数字求和。返回最终整数。

自建示例
--------

.. code-block:: text

   输入：s = "abc", k = 1
   输出：6
   解释：转换为 123，各位和为 1 + 2 + 3。

.. code-block:: text

   输入：s = "zz", k = 2
   输出：7
   解释：2626 的数字和为 16，再求和得到 7。
