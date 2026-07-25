1792. Maximum Average Pass Ratio
===============================

题目信息
--------

:题号: 1792
:难度: Medium
:主题: 贪心、优先队列
:原题: `LeetCode 1792 <https://leetcode.com/problems/maximum-average-pass-ratio/>`_
:重点: 每名额外学生必定通过，应分配给通过率边际提升最大的班级

题目重述
--------

每个班级为 ``[pass,total]``。把 ``extraStudents`` 名必过学生分配到各班，返回所有班级通过率平均值的最大值。

自建示例
--------

.. code-block:: text

   输入：classes = [[1,2]], extraStudents = 1
   输出：0.6666666667
   解释：加入一名必过学生后通过率为 2/3。

.. code-block:: text

   输入：classes = [[2,2],[3,3]], extraStudents = 2
   输出：1.0
   解释：所有班级原本已全部通过，分配后平均值仍为 1。