1964. Find the Longest Valid Obstacle Course at Each Position
============================================================

题目信息
--------

:题号: 1964
:难度: Hard
:主题: 最长非递减子序列、二分查找
:原题: `LeetCode 1964 <https://leetcode.com/problems/find-the-longest-valid-obstacle-course-at-each-position/>`_
:重点: 每个位置的答案必须使用该位置作为子序列末尾

题目重述
--------

对每个下标 ``i``，返回从前缀中选择并以 ``obstacles[i]`` 结尾的最长非递减子序列长度。

自建示例
--------

.. code-block:: text

   输入：obstacles = [1,2,3,2]
   输出：[1,2,3,3]
   解释：最后位置可使用子序列 [1,2,2]。

.. code-block:: text

   输入：obstacles = [3,2,1]
   输出：[1,1,1]
   解释：每个新元素都更小，只能单独作为结尾。
