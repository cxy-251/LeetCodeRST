0177. Nth Highest Salary
========================

题目信息
--------

:题号: 0177
:难度: Medium
:主题: Database、SQL 函数、去重、排名
:原题: `LeetCode 177 <https://leetcode.com/problems/nth-highest-salary/>`_
:重点: 第 N 个不同薪资、一基排名、重复值不重复计名次、不存在返回 NULL

题目重述
--------

``Employee`` 表包含员工标识 ``id`` 和薪资 ``salary``。实现数据库函数 ``getNthHighestSalary(N)``，返回表中第 ``N`` 高的**不同薪资值**。

``N`` 按一基排名计算：``N = 1`` 表示最高薪资。多名员工的薪资相同时，该值只占一个名次；若不同薪资等级不足 ``N`` 个，函数返回 ``NULL``。

自建示例
--------

.. code-block:: text

   Employee:
   id | salary
   1  | 7200
   2  | 5400
   3  | 7200
   4  | 4600

   输入：N = 2
   输出：5400
   解释：不同薪资按降序为 7200、5400、4600，重复的 7200 不占第二个名次。

.. code-block:: text

   使用同一张表，输入：N = 4
   输出：NULL
   解释：表中只有三个不同薪资等级，不存在第 4 高薪资。