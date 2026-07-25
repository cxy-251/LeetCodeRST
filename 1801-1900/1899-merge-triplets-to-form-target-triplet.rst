1899. Merge Triplets to Form Target Triplet
===========================================

题目信息
--------

:题号: 1899
:难度: Medium
:主题: 贪心、数组
:原题: `LeetCode 1899 <https://leetcode.com/problems/merge-triplets-to-form-target-triplet/>`_
:重点: 合并操作对三个坐标分别取最大值

题目重述
--------

可以反复选择两个三元组并把其中一个替换为逐坐标最大值。判断最终能否得到指定 ``target`` 三元组。

自建示例
--------

.. code-block:: text

   输入：triplets = [[1,2,3],[2,1,3]], target = [2,2,3]
   输出：true
   解释：合并两个三元组后得到 [2,2,3]。

.. code-block:: text

   输入：triplets = [[3,1,1]], target = [2,1,1]
   输出：false
   解释：唯一三元组第一项超过目标，取最大值无法降低它。
