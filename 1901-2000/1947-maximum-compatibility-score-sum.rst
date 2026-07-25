1947. Maximum Compatibility Score Sum
=====================================

题目信息
--------

:题号: 1947
:难度: Medium
:主题: 状态压缩、回溯、匹配
:原题: `LeetCode 1947 <https://leetcode.com/problems/maximum-compatibility-score-sum/>`_
:重点: 学生与导师一一匹配，兼容分是答案相同的问题数量

题目重述
--------

学生和导师数量相同，每人有一组二进制答案。将每名学生分配给唯一导师，最大化所有配对答案相同位置数之和。

自建示例
--------

.. code-block:: text

   输入：students = [[1,0],[0,1]], mentors = [[1,0],[1,1]]
   输出：3
   解释：第一名学生配第一名导师得 2 分，第二名学生配第二名导师得 1 分。

.. code-block:: text

   输入：students = [[0]], mentors = [[1]]
   输出：0
   解释：唯一一题答案不同。
