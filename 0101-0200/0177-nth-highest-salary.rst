0177. Nth Highest Salary
========================

题目信息
--------

:题号: 0177
:难度: Medium
:类型: Database
:主题: SQL 函数、去重、排序、分页
:原题: `LeetCode 177 <https://leetcode.com/problems/nth-highest-salary/>`_
:教学重点: 将一基排名转换为查询偏移量，并确保重复薪资不会占用多个名次。

题目重述
--------

实现函数 ``getNthHighestSalary(N)``，返回 ``Employee`` 表中第 ``N`` 高的不同薪资。相同薪资属于同一等级；若不存在第 ``N`` 个不同薪资，返回 ``NULL``。

自建示例
--------

.. code-block:: text

   Employee.salary = [500, 300, 500, 200]

   getNthHighestSalary(1) -> 500
   getNthHighestSalary(2) -> 300
   getNthHighestSalary(4) -> NULL
