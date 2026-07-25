1733. Minimum Number of People to Teach
=======================================

题目信息
--------

:题号: 1733
:难度: Medium
:主题: 集合、枚举、社交关系
:原题: `LeetCode 1733 <https://leetcode.com/problems/minimum-number-of-people-to-teach/>`_
:重点: 选择一种语言，只给无法沟通的友谊涉及用户中部分人教学

题目重述
--------

每位用户掌握若干语言，友谊双方只要共享一种语言即可沟通。选择一种语言并教给若干用户，使所有朋友都能沟通，返回最少教学人数。

自建示例
--------

.. code-block:: text

   输入：n = 2, languages = [[1],[2]], friendships = [[1,2]]
   输出：1
   解释：给任一用户教授另一方掌握的语言即可。

.. code-block:: text

   输入：n = 2, languages = [[1],[1,2]], friendships = [[1,2]]
   输出：0
   解释：双方已经共享语言 1。