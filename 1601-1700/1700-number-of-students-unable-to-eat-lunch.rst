1700. Number of Students Unable to Eat Lunch
============================================

题目信息
--------

:题号: 1700
:难度: Easy
:主题: 队列、计数、模拟
:原题: `LeetCode 1700 <https://leetcode.com/problems/number-of-students-unable-to-eat-lunch/>`_
:重点: 队首学生不喜欢栈顶三明治时移到队尾，直到无人愿意拿当前三明治

题目重述
--------

学生按队列排列，三明治按栈顶顺序给出。喜欢当前类型的队首学生取走三明治并离开，否则移到队尾。返回最终无法吃到午餐的学生数。

自建示例
--------

.. code-block:: text

   输入：students = [1,1,1,0,0,1], sandwiches = [1,0,0,0,1,1]
   输出：3
   解释：处理到某个 0 型三明治时，剩余三名学生都只喜欢 1 型。

.. code-block:: text

   输入：students = [0,1], sandwiches = [0,1]
   输出：0
   解释：两名学生按顺序都能取到喜欢的三明治。